import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection } from 'chromadb';
import { Document } from '@langchain/core/documents';

/**
 * Metadata stored with each document in ChromaDB
 */
export interface DocumentMetadata {
  source: string;
  fileType: string;
  chunkIndex?: number;
  totalChunks?: number;
  [key: string]: unknown;
}

/**
 * Result from a similarity search
 */
export interface SearchResult {
  id: string;
  document: string;
  metadata: DocumentMetadata;
  distance: number;
}

/**
 * Service for managing vector storage using ChromaDB
 * Stores document embeddings with metadata for retrieval
 */
@Injectable()
export class ChromaStoreService implements OnModuleInit {
  private readonly logger = new Logger(ChromaStoreService.name);
  private chromaClient: ChromaClient | null = null;
  private collection: Collection | null = null;
  private readonly collectionName: string;
  private readonly chromaUrl: string;
  private readonly apiKey: string;
  private readonly tenant: string;
  private readonly database: string;
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {
    this.collectionName =
      this.configService.get<string>('vectorDb.collectionName') || 'rag_documents';
    this.chromaUrl =
      this.configService.get<string>('vectorDb.url') || 'http://localhost:8000';
    this.apiKey = this.configService.get<string>('vectorDb.apiKey') || '';
    this.tenant = this.configService.get<string>('vectorDb.tenant') || 'default_tenant';
    this.database = this.configService.get<string>('vectorDb.database') || 'default_database';
    
    this.logger.log(`Configured ChromaDB URL: ${this.chromaUrl}`);
    this.logger.log(`Collection: ${this.collectionName}`);
    if (this.apiKey) {
      this.logger.log(`Authentication: Enabled (API Key configured)`);
    }
  }

  /**
   * Initialize ChromaDB client and collection on module init
   * Non-blocking - logs error but doesn't fail startup
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.initialize();
    } catch (error) {
      this.logger.warn(
        'ChromaDB initialization failed during startup. Vector store will not be available.',
      );
      this.logger.warn(
        'To use ChromaDB, either start a ChromaDB server or the application will work without vector storage.',
      );
    }
  }

  /**
   * Initialize ChromaDB client and get or create collection
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.logger.log(`Connecting to ChromaDB at: ${this.chromaUrl}`);

      // Initialize ChromaDB client with configurable URL
      // Works for both local (Docker) and cloud-hosted ChromaDB
      const clientConfig: {
        path: string;
        auth?: { provider: string; credentials: string };
        tenant?: string;
        database?: string;
      } = {
        path: this.chromaUrl,
      };

      // Add authentication if API key is provided (for cloud deployments)
      if (this.apiKey) {
        clientConfig.auth = {
          provider: 'token',
          credentials: this.apiKey,
        };
      }

      // Add tenant/database for multi-tenant setups
      if (this.tenant !== 'default_tenant') {
        clientConfig.tenant = this.tenant;
      }
      if (this.database !== 'default_database') {
        clientConfig.database = this.database;
      }

      this.chromaClient = new ChromaClient(clientConfig);

      // Get or create collection
      try {
        this.collection = await this.chromaClient.getOrCreateCollection({
          name: this.collectionName,
          metadata: { description: 'RAG application document embeddings' },
        });
        this.logger.log(`Collection '${this.collectionName}' ready`);
      } catch (error) {
        this.logger.error(
          `Failed to get or create collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        throw error;
      }

      this.isInitialized = true;
      this.logger.log('ChromaDB initialized successfully');
    } catch (error) {
      this.logger.error(
        `Failed to initialize ChromaDB: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't throw - let the app run without ChromaDB
      this.isInitialized = false;
      this.chromaClient = null;
      this.collection = null;
    }
  }

  /**
   * Add documents with their embeddings to the vector store
   * @param documents Array of LangChain Document objects
   * @param embeddings Array of embedding vectors (same order as documents)
   * @param ids Optional array of IDs (generated if not provided)
   */
  async addDocuments(documents: Document[], embeddings: number[][], ids?: string[]): Promise<void> {
    if (documents.length !== embeddings.length) {
      throw new Error('Number of documents must match number of embeddings');
    }

    if (documents.length === 0) {
      this.logger.warn('No documents to add');
      return;
    }

    await this.ensureInitialized();

    try {
      // Generate IDs if not provided
      const documentIds = ids || documents.map((_, index) => `doc_${Date.now()}_${index}`);

      // Prepare metadata - ChromaDB only accepts string, number, boolean
      const metadatas = documents.map((doc) => this.sanitizeMetadata(doc.metadata));

      this.logger.log(`Adding ${documents.length} documents to collection`);

      // Add to ChromaDB
      // Note: ChromaDB JS client expects 'metadatas' (plural)
      await this.collection!.add({
        ids: documentIds,
        embeddings: embeddings,
        documents: documents.map((doc) => doc.pageContent),
        metadatas: metadatas,
      });

      this.logger.log(`Successfully added ${documents.length} documents to vector store`);
    } catch (error) {
      this.logger.error(
        `Failed to add documents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Adding documents to vector store failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Perform similarity search to find relevant documents
   * @param queryEmbedding Embedding vector of the query
   * @param topK Number of results to return (default: 5)
   * @param filter Optional metadata filter
   * @returns Array of search results with documents and distances
   */
  async similaritySearch(
    queryEmbedding: number[],
    topK = 5,
    filter?: Record<string, unknown>,
  ): Promise<SearchResult[]> {
    await this.ensureInitialized();

    try {
      this.logger.log(`Performing similarity search (topK=${topK})`);

      const results = await this.collection!.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        where: filter,
      });

      // Transform results
      const searchResults: SearchResult[] = [];

      if (
        results.ids &&
        results.ids[0] &&
        results.documents &&
        results.documents[0] &&
        results.distances &&
        results.distances[0] &&
        results.metadatas &&
        results.metadatas[0]
      ) {
        for (let i = 0; i < results.ids[0].length; i++) {
          searchResults.push({
            id: results.ids[0][i],
            document: results.documents[0][i] as string,
            metadata: results.metadatas[0][i] as DocumentMetadata,
            distance: results.distances[0][i],
          });
        }
      }

      this.logger.log(`Found ${searchResults.length} similar documents`);

      return searchResults;
    } catch (error) {
      this.logger.error(
        `Similarity search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Similarity search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete documents by IDs
   * @param ids Array of document IDs to delete
   */
  async deleteDocuments(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await this.ensureInitialized();

    try {
      this.logger.log(`Deleting ${ids.length} documents from vector store`);

      await this.collection!.delete({
        ids: ids,
      });

      this.logger.log(`Successfully deleted ${ids.length} documents`);
    } catch (error) {
      this.logger.error(
        `Failed to delete documents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Deleting documents from vector store failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete all documents matching a metadata filter
   * @param filter Metadata filter
   */
  async deleteByFilter(filter: Record<string, unknown>): Promise<void> {
    await this.ensureInitialized();

    try {
      this.logger.log('Deleting documents by filter');

      await this.collection!.delete({
        where: filter,
      });

      this.logger.log('Successfully deleted documents by filter');
    } catch (error) {
      this.logger.error(
        `Failed to delete by filter: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Deleting by filter failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get collection statistics
   */
  async getCollectionStats(): Promise<{
    name: string;
    count: number;
    metadata: Record<string, unknown>;
  }> {
    await this.ensureInitialized();

    try {
      const count = await this.collection!.count();
      const metadata = this.collection!.metadata;

      return {
        name: this.collectionName,
        count,
        metadata: metadata || {},
      };
    } catch (error) {
      this.logger.error(
        `Failed to get collection stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(
        `Getting collection stats failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Clear all documents from the collection
   */
  async clearCollection(): Promise<void> {
    await this.ensureInitialized();

    try {
      this.logger.warn('Clearing all documents from collection');

      // Delete the collection and recreate it
      await this.chromaClient!.deleteCollection({ name: this.collectionName });
      this.collection = await this.chromaClient!.createCollection({
        name: this.collectionName,
        metadata: { description: 'RAG application document embeddings' },
      });

      this.logger.log('Collection cleared successfully');
    } catch (error) {
      this.logger.error(
        `Failed to clear collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Clearing collection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.collection !== null;
  }

  /**
   * Sanitize metadata to only include types supported by ChromaDB
   * ChromaDB only supports: string, number, boolean
   */
  private sanitizeMetadata(metadata: Record<string, unknown>): Record<string, string | number | boolean> {
    const sanitized: Record<string, string | number | boolean> = {};
    
    for (const [key, value] of Object.entries(metadata)) {
      if (value === null || value === undefined) {
        continue; // Skip null/undefined
      }
      
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (typeof value === 'object') {
        // Convert objects/arrays to JSON strings
        sanitized[key] = JSON.stringify(value);
      } else {
        // Convert everything else to string
        sanitized[key] = String(value);
      }
    }
    
    return sanitized;
  }

  /**
   * Ensure the service is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.collection) {
      await this.initialize();
    }
  }
}
