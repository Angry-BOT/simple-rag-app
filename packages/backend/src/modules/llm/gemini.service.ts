import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

/**
 * Context document for RAG
 */
export interface ContextDocument {
  content: string;
  metadata: Record<string, unknown>;
  score: number;
}

/**
 * Service for interacting with Google's Gemini LLM via LangChain
 * Provides RAG-enabled chat functionality
 */
@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);
  private llm: ChatGoogleGenerativeAI | null = null;
  private ragPromptTemplate: ChatPromptTemplate | null = null;
  private readonly modelName: string;
  private readonly temperature: number;
  private readonly maxOutputTokens: number;
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {
    this.modelName = this.configService.get<string>('llm.model') || 'gemini-2.5-flash';
    this.temperature = this.configService.get<number>('llm.temperature') || 0.7;
    this.maxOutputTokens = this.configService.get<number>('llm.maxTokens') || 2048;
    this.logger.log(`Configured model: ${this.modelName}`);
  }

  /**
   * Initialize Gemini LLM and RAG chain on module init
   * Non-blocking - logs error but doesn't fail startup
   */
  onModuleInit(): void {
    try {
      this.initialize();
    } catch (error) {
      this.logger.warn(
        'Gemini LLM initialization failed during startup. Chat functionality will not be available.',
      );
      this.logger.warn(
        'To use chat, set GOOGLE_API_KEY in your .env file. Get one from: https://makersuite.google.com/app/apikey',
      );
    }
  }

  /**
   * Initialize the Gemini LLM and RAG chain
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.logger.log('Initializing Gemini LLM...');

      const apiKey = this.configService.get<string>('llm.googleApiKey');
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('GOOGLE_API_KEY not configured. Please set it in environment variables.');
      }

      // Initialize Gemini model
      this.llm = new ChatGoogleGenerativeAI({
        modelName: this.modelName,
        temperature: this.temperature,
        maxOutputTokens: this.maxOutputTokens,
        apiKey: apiKey,
      });

      // Create RAG prompt template
      this.ragPromptTemplate = ChatPromptTemplate.fromMessages([
        [
          'system',
          `You are a helpful AI assistant that answers questions based on the provided context.
Use the following pieces of context to answer the user's question.
If you don't know the answer based on the context, just say that you don't know, don't try to make up an answer.
Keep your answer concise and relevant to the question.
Always cite which source documents you used by mentioning their file names when applicable.

Context:
{context}`,
        ],
        ['human', '{question}'],
      ]);

      this.isInitialized = true;
      this.logger.log('Gemini LLM initialized successfully');
    } catch (error) {
      this.logger.error(
        `Failed to initialize Gemini LLM: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Gemini LLM initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate a response using RAG (Retrieval-Augmented Generation)
   * @param question User's question
   * @param contextDocuments Retrieved relevant documents
   * @returns Generated answer
   */
  async generateRagResponse(
    question: string,
    contextDocuments: ContextDocument[],
  ): Promise<string> {
    this.ensureInitialized();

    if (!question || question.trim().length === 0) {
      throw new Error('Question cannot be empty');
    }

    try {
      // Format context from documents
      const context = this.formatContext(contextDocuments);

      this.logger.log(
        `Generating RAG response for question: "${question.substring(0, 50)}..." with ${contextDocuments.length} context documents`,
      );

      // Create the prompt messages manually
      const systemMessage = `You are a helpful AI assistant that answers questions based on the provided context.
Use the following pieces of context to answer the user's question.
If you don't know the answer based on the context, just say that you don't know, don't try to make up an answer.
Keep your answer concise and relevant to the question.
Always cite which source documents you used by mentioning their file names when applicable.

Context:
${context}`;

      // Invoke the LLM with simple message format
      const response = await this.llm!.invoke([
        ['system', systemMessage],
        ['human', question],
      ]);

      this.logger.log('Successfully generated RAG response');

      return response.content as string;
    } catch (error) {
      this.logger.error(
        `Failed to generate RAG response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `RAG response generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate a simple chat response without RAG context
   * @param message User's message
   * @returns Generated response
   */
  async generateChatResponse(message: string): Promise<string> {
    this.ensureInitialized();

    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    try {
      this.logger.log(`Generating chat response for: "${message.substring(0, 50)}..."`);

      const response = await this.llm!.invoke([['human', message]]);

      this.logger.log('Successfully generated chat response');

      return response.content as string;
    } catch (error) {
      this.logger.error(
        `Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Chat response generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Format context documents into a string for the prompt
   * @param documents Array of context documents
   * @returns Formatted context string
   */
  private formatContext(documents: ContextDocument[]): string {
    if (documents.length === 0) {
      return 'No relevant context found in the knowledge base.';
    }

    return documents
      .map((doc, index) => {
        const fileName = String(doc.metadata.fileName || doc.metadata.source || 'Unknown source');
        const fileType = String(doc.metadata.fileType || '');
        const score = doc.score ? ` (relevance: ${(doc.score * 100).toFixed(1)}%)` : '';

        return `
Document ${index + 1} [${fileName}${fileType ? `, type: ${fileType}` : ''}${score}]:
${doc.content}
`;
      })
      .join('\n---\n');
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.llm !== null && this.ragPromptTemplate !== null;
  }

  /**
   * Get the current model name
   */
  getModelName(): string {
    return this.modelName;
  }

  /**
   * Ensure the service is initialized before use
   */
  private ensureInitialized(): void {
    if (!this.isInitialized || !this.llm || !this.ragPromptTemplate) {
      this.initialize();
    }
  }
}
