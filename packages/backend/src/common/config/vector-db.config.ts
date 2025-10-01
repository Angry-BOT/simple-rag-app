import { registerAs } from '@nestjs/config';

/**
 * Vector database configuration
 */
export const vectorDbConfig = registerAs('vectorDb', () => ({
  dir: process.env.VECTOR_DB_DIR || './storage/vector-db',
  collectionName: process.env.CHROMA_COLLECTION_NAME || 'rag_documents',
}));
