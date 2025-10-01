import { registerAs } from '@nestjs/config';

/**
 * Embeddings configuration
 */
export const embeddingsConfig = registerAs('embeddings', () => ({
  model: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
  dimension: parseInt(process.env.EMBEDDING_DIMENSION || '384', 10),
}));
