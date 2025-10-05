import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pipeline } from '@xenova/transformers';

/**
 * Service for generating embeddings using HuggingFace models via Xenova Transformers
 * Uses all-MiniLM-L6-v2 model by default
 */
@Injectable()
export class HuggingFaceEmbeddingsService implements OnModuleInit {
  private readonly logger = new Logger(HuggingFaceEmbeddingsService.name);
  private readonly modelName: string;
  private embeddingPipeline: Awaited<ReturnType<typeof pipeline>> | null = null;
  private readonly embeddingDimension = 384; // all-MiniLM-L6-v2 outputs 384-dimensional vectors
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {
    this.modelName =
      this.configService.get<string>('embeddings.model') || 'Xenova/all-MiniLM-L6-v2';
    this.logger.log(`Configured to use model: ${this.modelName}`);
  }

  /**
   * Initialize the embedding pipeline on module init
   */
  async onModuleInit(): Promise<void> {
    await this.initializePipeline();
  }

  /**
   * Initialize the embedding pipeline
   * Downloads the model on first use and caches it locally
   */
  private async initializePipeline(): Promise<void> {
    if (this.isInitialized && this.embeddingPipeline) {
      return;
    }

    try {
      this.logger.log(`Initializing embedding pipeline with model: ${this.modelName}`);
      this.logger.log('First run will download the model (~90MB), subsequent runs use cache');

      this.embeddingPipeline = await pipeline('feature-extraction', this.modelName);

      this.isInitialized = true;
      this.logger.log('Embedding pipeline initialized successfully');
    } catch (error) {
      this.logger.error(
        `Failed to initialize embedding pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Embedding pipeline initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate embeddings for a single text
   * @param text Text to generate embeddings for
   * @returns Embedding vector as number array
   */
  async embedText(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      throw new Error('Cannot generate embeddings for empty text');
    }

    await this.ensureInitialized();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
      const output = (await (this.embeddingPipeline as any)(text, {
        pooling: 'mean',
        normalize: true,
      })) as { data: Float32Array };

      // Convert tensor to array
      const embedding = Array.from(output.data);

      this.logger.debug(
        `Generated embedding for text (${text.length} chars) - dimension: ${embedding.length}`,
      );

      return embedding;
    } catch (error) {
      this.logger.error(
        `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * More efficient than calling embedText multiple times
   * @param texts Array of texts to generate embeddings for
   * @returns Array of embedding vectors
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!texts || texts.length === 0) {
      return [];
    }

    // Filter out empty texts
    const validTexts = texts.filter((text) => text && text.trim().length > 0);

    if (validTexts.length === 0) {
      this.logger.warn('All texts in batch were empty');
      return [];
    }

    await this.ensureInitialized();

    this.logger.log(`Generating embeddings for batch of ${validTexts.length} texts`);

    try {
      // Process texts one by one for now (Xenova doesn't support true batching yet)
      // In production, you might want to add parallelization with Promise.all
      const embeddings: number[][] = [];

      for (let i = 0; i < validTexts.length; i++) {
        const text = validTexts[i];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        const output = (await (this.embeddingPipeline as any)(text, {
          pooling: 'mean',
          normalize: true,
        })) as { data: Float32Array };

        embeddings.push(Array.from(output.data));

        // Log progress for large batches
        if (validTexts.length > 10 && (i + 1) % 10 === 0) {
          this.logger.log(`Processed ${i + 1}/${validTexts.length} embeddings`);
        }
      }

      this.logger.log(
        `Successfully generated ${embeddings.length} embeddings (${this.embeddingDimension}D each)`,
      );

      return embeddings;
    } catch (error) {
      this.logger.error(
        `Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Batch embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate embeddings for multiple texts with parallel processing
   * @param texts Array of texts to generate embeddings for
   * @param batchSize Number of texts to process in parallel
   * @returns Array of embedding vectors
   */
  async embedBatchParallel(texts: string[], batchSize = 5): Promise<number[][]> {
    if (!texts || texts.length === 0) {
      return [];
    }

    const validTexts = texts.filter((text) => text && text.trim().length > 0);

    if (validTexts.length === 0) {
      return [];
    }

    await this.ensureInitialized();

    this.logger.log(
      `Generating embeddings in parallel for ${validTexts.length} texts (batch size: ${batchSize})`,
    );

    try {
      const embeddings: number[][] = [];

      // Process in batches
      for (let i = 0; i < validTexts.length; i += batchSize) {
        const batch = validTexts.slice(i, i + batchSize);
        const batchEmbeddings = await Promise.all(batch.map((text) => this.embedText(text)));

        embeddings.push(...batchEmbeddings);

        this.logger.log(
          `Processed ${Math.min(i + batchSize, validTexts.length)}/${validTexts.length} embeddings`,
        );
      }

      this.logger.log(`Successfully generated ${embeddings.length} embeddings in parallel`);

      return embeddings;
    } catch (error) {
      this.logger.error(
        `Failed to generate parallel batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error,
      );
      throw new Error(
        `Parallel batch embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get the dimension of the embedding vectors
   */
  getEmbeddingDimension(): number {
    return this.embeddingDimension;
  }

  /**
   * Get the model name being used
   */
  getModelName(): string {
    return this.modelName;
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.embeddingPipeline !== null;
  }

  /**
   * Ensure the pipeline is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.embeddingPipeline) {
      await this.initializePipeline();
    }
  }

  /**
   * Calculate cosine similarity between two embedding vectors
   * Useful for testing and validation
   * @param embedding1 First embedding vector
   * @param embedding2 Second embedding vector
   * @returns Similarity score between -1 and 1 (1 = identical)
   */
  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}
