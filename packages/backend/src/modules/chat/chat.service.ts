import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../llm/gemini.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { ChatQueryDto, ChatResponseDto, SourceDocumentDto } from './dto/chat-query.dto';

/**
 * Service for handling chat interactions with RAG
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly ingestionService: IngestionService,
  ) {
    this.logger.log('Chat service initialized');
  }

  /**
   * Process a chat query with RAG
   * @param chatQuery The chat query from the user
   * @returns Chat response with answer and sources
   */
  async query(chatQuery: ChatQueryDto): Promise<ChatResponseDto> {
    const startTime = Date.now();
    const { question, topK = 5 } = chatQuery;

    this.logger.log(`Processing chat query: "${question.substring(0, 50)}..."`);

    try {
      // Step 1: Retrieve relevant documents from vector store
      this.logger.log(`Retrieving top ${topK} relevant documents`);
      const relevantDocs = await this.ingestionService.queryDocuments(question, topK);

      if (relevantDocs.length === 0) {
        this.logger.warn('No relevant documents found in knowledge base');
      } else {
        this.logger.log(`Found ${relevantDocs.length} relevant documents`);
      }

      // Step 2: Prepare context documents for LLM
      const contextDocuments = relevantDocs.map((doc) => ({
        content: doc.content,
        metadata: doc.metadata,
        score: doc.score,
      }));

      // Step 3: Generate response using Gemini with RAG
      this.logger.log('Generating AI response with context');
      const answer = await this.geminiService.generateRagResponse(question, contextDocuments);

      // Step 4: Format source documents for response
      const sources = this.formatSources(relevantDocs);

      const responseTime = Date.now() - startTime;

      const response: ChatResponseDto = {
        answer,
        question,
        sources,
        responseTimeMs: responseTime,
        model: this.geminiService.getModelName(),
      };

      this.logger.log(
        `Chat query processed successfully in ${responseTime}ms with ${sources.length} sources`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to process chat query: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Chat query processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Check if the chat service is ready
   */
  isReady(): {
    gemini: boolean;
    ingestion: boolean;
    overall: boolean;
  } {
    const geminiReady = this.geminiService.isReady();
    const ingestionStatus = this.ingestionService.getHealthStatus();

    return {
      gemini: geminiReady,
      ingestion: ingestionStatus.overall,
      overall: geminiReady && ingestionStatus.overall,
    };
  }

  /**
   * Format source documents for response
   * @param documents Retrieved documents
   * @returns Formatted source document DTOs
   */
  private formatSources(
    documents: Array<{
      content: string;
      metadata: Record<string, unknown>;
      score: number;
    }>,
  ): SourceDocumentDto[] {
    return documents.map((doc) => ({
      fileName: (doc.metadata.fileName as string) || 'Unknown',
      fileType: (doc.metadata.fileType as string) || 'unknown',
      chunkIndex: (doc.metadata.chunkIndex as number) || 0,
      relevanceScore: Math.round(doc.score * 100) / 100, // Round to 2 decimals
      excerpt: this.createExcerpt(doc.content),
    }));
  }

  /**
   * Create a brief excerpt from document content
   * @param content Full content
   * @returns Shortened excerpt
   */
  private createExcerpt(content: string, maxLength = 200): string {
    if (content.length <= maxLength) {
      return content;
    }

    // Try to cut at a sentence boundary
    const excerpt = content.substring(0, maxLength);
    const lastPeriod = excerpt.lastIndexOf('.');
    const lastSpace = excerpt.lastIndexOf(' ');

    if (lastPeriod > maxLength * 0.7) {
      return excerpt.substring(0, lastPeriod + 1);
    } else if (lastSpace > maxLength * 0.7) {
      return excerpt.substring(0, lastSpace) + '...';
    }

    return excerpt + '...';
  }
}
