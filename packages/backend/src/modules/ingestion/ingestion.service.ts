import { Injectable, Logger } from '@nestjs/common';
import { DocumentParserService } from './parsers/document-parser.service';
import { SemanticChunkerService, ChunkingOptions } from './chunking/semantic-chunker.service';
import { HuggingFaceEmbeddingsService } from './embeddings/huggingface-embeddings.service';
import { ChromaStoreService } from './vector-store/chroma-store.service';

/**
 * Result of the ingestion process
 */
export interface IngestionResult {
  fileId: string;
  fileName: string;
  documentsCount: number;
  chunksCount: number;
  vectorsStored: number;
  processingTimeMs: number;
}

/**
 * Orchestration service for the complete document ingestion pipeline
 * Coordinates: parsing → chunking → embedding → vector storage
 */
@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly parserService: DocumentParserService,
    private readonly chunkerService: SemanticChunkerService,
    private readonly embeddingsService: HuggingFaceEmbeddingsService,
    private readonly vectorStoreService: ChromaStoreService,
  ) {
    this.logger.log('Ingestion service initialized');
  }

  /**
   * Process a file through the complete ingestion pipeline
   * @param filePath Path to the file
   * @param fileType File extension (pdf, txt, html)
   * @param fileId Unique identifier for the file
   * @param fileName Original file name
   * @param chunkingOptions Optional chunking configuration
   * @returns Ingestion result with statistics
   */
  async ingestFile(
    filePath: string,
    fileType: string,
    fileId: string,
    fileName: string,
    chunkingOptions?: ChunkingOptions,
  ): Promise<IngestionResult> {
    const startTime = Date.now();

    this.logger.log(`Starting ingestion for file: ${fileName} (${fileType})`);

    try {
      // Step 1: Parse the document
      this.logger.log(`[1/4] Parsing document...`);
      const documents = await this.parserService.parseDocument(filePath, fileType);

      if (documents.length === 0) {
        throw new Error('No documents extracted from file');
      }

      this.logger.log(`Parsed ${documents.length} document(s)`);

      // Step 2: Chunk the documents
      this.logger.log(`[2/4] Chunking documents...`);
      const chunks = await this.chunkerService.chunkDocuments(documents, chunkingOptions);

      if (chunks.length === 0) {
        throw new Error('No chunks generated from documents');
      }

      this.logger.log(`Generated ${chunks.length} chunks`);

      // Step 3: Generate embeddings
      this.logger.log(`[3/4] Generating embeddings...`);
      const chunkTexts = chunks.map((chunk) => chunk.pageContent);
      const embeddings = await this.embeddingsService.embedBatchParallel(chunkTexts, 5);

      if (embeddings.length !== chunks.length) {
        throw new Error('Mismatch between chunks and embeddings count');
      }

      this.logger.log(`Generated ${embeddings.length} embeddings`);

      // Step 4: Store in vector database
      this.logger.log(`[4/4] Storing in vector database...`);

      // Enrich chunk metadata with file information
      const enrichedChunks = chunks.map((chunk) => ({
        ...chunk,
        metadata: {
          ...chunk.metadata,
          fileId,
          fileName,
          ingestedAt: new Date().toISOString(),
        },
      }));

      // Generate IDs for chunks
      const chunkIds = chunks.map((_, index) => `${fileId}_chunk_${index}`);

      await this.vectorStoreService.addDocuments(enrichedChunks, embeddings, chunkIds);

      const processingTime = Date.now() - startTime;

      const result: IngestionResult = {
        fileId,
        fileName,
        documentsCount: documents.length,
        chunksCount: chunks.length,
        vectorsStored: embeddings.length,
        processingTimeMs: processingTime,
      };

      this.logger.log(
        `Ingestion complete for ${fileName}: ${chunks.length} chunks in ${processingTime}ms`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Ingestion failed for ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `File ingestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Process multiple files in batch
   * @param files Array of file information
   * @param chunkingOptions Optional chunking configuration
   * @returns Array of ingestion results
   */
  async ingestBatch(
    files: Array<{
      filePath: string;
      fileType: string;
      fileId: string;
      fileName: string;
    }>,
    chunkingOptions?: ChunkingOptions,
  ): Promise<IngestionResult[]> {
    this.logger.log(`Starting batch ingestion for ${files.length} files`);

    const results: IngestionResult[] = [];

    for (const file of files) {
      try {
        const result = await this.ingestFile(
          file.filePath,
          file.fileType,
          file.fileId,
          file.fileName,
          chunkingOptions,
        );
        results.push(result);
      } catch (error) {
        this.logger.error(
          `Failed to ingest ${file.fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        // Continue with other files even if one fails
      }
    }

    this.logger.log(`Batch ingestion complete: ${results.length}/${files.length} succeeded`);

    return results;
  }

  /**
   * Delete all document chunks associated with a file
   * @param fileId File identifier
   */
  async deleteFileVectors(fileId: string): Promise<void> {
    this.logger.log(`Deleting vectors for file: ${fileId}`);

    try {
      await this.vectorStoreService.deleteByFilter({ fileId });
      this.logger.log(`Successfully deleted vectors for file: ${fileId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete vectors for ${fileId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Deleting file vectors failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Query the vector store for relevant document chunks
   * @param query Query text
   * @param topK Number of results to return (default: 5)
   * @returns Array of relevant document chunks with metadata
   */
  async queryDocuments(
    query: string,
    topK = 5,
  ): Promise<
    Array<{
      content: string;
      metadata: Record<string, unknown>;
      score: number;
    }>
  > {
    this.logger.log(`Querying documents with: "${query.substring(0, 50)}..."`);

    try {
      // Generate query embedding
      const queryEmbedding = await this.embeddingsService.embedText(query);

      // Search vector store
      const results = await this.vectorStoreService.similaritySearch(queryEmbedding, topK);

      // Transform results
      const documents = results.map((result) => ({
        content: result.document,
        metadata: result.metadata,
        score: 1 - result.distance, // Convert distance to similarity score
      }));

      this.logger.log(`Found ${documents.length} relevant documents`);

      return documents;
    } catch (error) {
      this.logger.error(
        `Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Document query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get ingestion pipeline health status
   */
  getHealthStatus(): {
    parser: boolean;
    chunker: boolean;
    embeddings: boolean;
    vectorStore: boolean;
    overall: boolean;
  } {
    const embeddingsReady = this.embeddingsService.isReady();
    const vectorStoreReady = this.vectorStoreService.isReady();

    return {
      parser: true, // Parser service doesn't have state
      chunker: true, // Chunker service doesn't have state
      embeddings: embeddingsReady,
      vectorStore: vectorStoreReady,
      overall: embeddingsReady && vectorStoreReady,
    };
  }
}
