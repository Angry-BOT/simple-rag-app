import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

/**
 * Configuration options for semantic chunking
 */
export interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separators?: string[];
  keepSeparator?: boolean;
}

/**
 * Service for semantically chunking documents using LangChain's RecursiveCharacterTextSplitter
 * Maintains semantic coherence by trying to keep larger units (paragraphs) intact
 */
@Injectable()
export class SemanticChunkerService {
  private readonly logger = new Logger(SemanticChunkerService.name);
  private readonly defaultChunkSize: number;
  private readonly defaultChunkOverlap: number;
  private readonly defaultSeparators: string[];

  constructor(private readonly configService: ConfigService) {
    this.defaultChunkSize = this.configService.get<number>('rag.chunkSize') || 1000;
    this.defaultChunkOverlap = this.configService.get<number>('rag.chunkOverlap') || 200;
    this.defaultSeparators = ['\n\n', '\n', '. ', ' ', ''];
    this.logger.log(
      `Initialized with default chunkSize=${this.defaultChunkSize}, chunkOverlap=${this.defaultChunkOverlap}`,
    );
  }

  /**
   * Split documents into semantic chunks
   * @param documents Array of LangChain Document objects
   * @param options Optional chunking configuration
   * @returns Array of chunked Document objects with preserved metadata
   */
  async chunkDocuments(documents: Document[], options?: ChunkingOptions): Promise<Document[]> {
    if (!documents || documents.length === 0) {
      this.logger.warn('No documents provided for chunking');
      return [];
    }

    const chunkSize = options?.chunkSize || this.defaultChunkSize;
    const chunkOverlap = options?.chunkOverlap || this.defaultChunkOverlap;
    const separators = options?.separators || this.defaultSeparators;
    const keepSeparator = options?.keepSeparator ?? false;

    this.logger.log(
      `Chunking ${documents.length} documents with chunkSize=${chunkSize}, chunkOverlap=${chunkOverlap}`,
    );

    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
        separators,
        keepSeparator,
      });

      const chunkedDocs = await splitter.splitDocuments(documents);

      // Add chunk metadata to each document
      const enrichedChunks = chunkedDocs.map((doc, index) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          chunkIndex: index,
          chunkSize,
          chunkOverlap,
          totalChunks: chunkedDocs.length,
        },
      }));

      this.logger.log(
        `Successfully chunked ${documents.length} documents into ${enrichedChunks.length} chunks`,
      );

      return enrichedChunks;
    } catch (error) {
      this.logger.error(
        `Failed to chunk documents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Document chunking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Split raw text into semantic chunks
   * @param text Raw text string
   * @param options Optional chunking configuration
   * @returns Array of text chunks
   */
  async chunkText(text: string, options?: ChunkingOptions): Promise<string[]> {
    if (!text || text.trim().length === 0) {
      this.logger.warn('Empty text provided for chunking');
      return [];
    }

    const chunkSize = options?.chunkSize || this.defaultChunkSize;
    const chunkOverlap = options?.chunkOverlap || this.defaultChunkOverlap;
    const separators = options?.separators || this.defaultSeparators;
    const keepSeparator = options?.keepSeparator ?? false;

    this.logger.log(`Chunking text (${text.length} characters) with chunkSize=${chunkSize}`);

    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
        separators,
        keepSeparator,
      });

      const chunks = await splitter.splitText(text);

      this.logger.log(
        `Successfully chunked text (${text.length} chars) into ${chunks.length} chunks`,
      );

      return chunks;
    } catch (error) {
      this.logger.error(
        `Failed to chunk text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Text chunking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Create Documents from raw text and chunk them
   * @param texts Array of text strings
   * @param metadatas Optional array of metadata objects (one per text)
   * @param options Optional chunking configuration
   * @returns Array of chunked Document objects
   */
  async createAndChunkDocuments(
    texts: string[],
    metadatas?: Record<string, unknown>[],
    options?: ChunkingOptions,
  ): Promise<Document[]> {
    if (!texts || texts.length === 0) {
      this.logger.warn('No texts provided for creating documents');
      return [];
    }

    const chunkSize = options?.chunkSize || this.defaultChunkSize;
    const chunkOverlap = options?.chunkOverlap || this.defaultChunkOverlap;
    const separators = options?.separators || this.defaultSeparators;
    const keepSeparator = options?.keepSeparator ?? false;

    this.logger.log(`Creating and chunking ${texts.length} texts with chunkSize=${chunkSize}`);

    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
        separators,
        keepSeparator,
      });

      const chunkedDocs = await splitter.createDocuments(texts, metadatas);

      // Add chunk metadata
      const enrichedChunks = chunkedDocs.map((doc, index) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          chunkIndex: index,
          chunkSize,
          chunkOverlap,
          totalChunks: chunkedDocs.length,
        },
      }));

      this.logger.log(
        `Successfully created and chunked ${texts.length} texts into ${enrichedChunks.length} chunks`,
      );

      return enrichedChunks;
    } catch (error) {
      this.logger.error(
        `Failed to create and chunk documents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Document creation and chunking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get chunk statistics for a set of documents
   * @param documents Array of LangChain Document objects
   * @param options Optional chunking configuration
   * @returns Statistics about the chunking operation
   */
  getChunkStatistics(
    documents: Document[],
    options?: ChunkingOptions,
  ): {
    originalDocCount: number;
    estimatedChunkCount: number;
    avgCharsPerDoc: number;
    avgCharsPerChunk: number;
  } {
    if (!documents || documents.length === 0) {
      return {
        originalDocCount: 0,
        estimatedChunkCount: 0,
        avgCharsPerDoc: 0,
        avgCharsPerChunk: 0,
      };
    }

    const chunkSize = options?.chunkSize || this.defaultChunkSize;
    const chunkOverlap = options?.chunkOverlap || this.defaultChunkOverlap;

    const totalChars = documents.reduce((sum, doc) => sum + doc.pageContent.length, 0);
    const avgCharsPerDoc = totalChars / documents.length;

    // Estimate chunk count (rough approximation)
    const estimatedChunkCount = Math.ceil(totalChars / (chunkSize - chunkOverlap));

    return {
      originalDocCount: documents.length,
      estimatedChunkCount,
      avgCharsPerDoc: Math.round(avgCharsPerDoc),
      avgCharsPerChunk: chunkSize,
    };
  }
}
