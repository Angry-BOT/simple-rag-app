import { registerAs } from '@nestjs/config';

/**
 * Vector database configuration
 * Supports both local (Docker) and cloud-hosted ChromaDB
 */
export const vectorDbConfig = registerAs('vectorDb', () => ({
  // ChromaDB server URL - can be local or cloud
  // Local: http://localhost:8000
  // Cloud examples: https://api.trychroma.com, https://your-chromadb.cloud
  url: process.env.CHROMADB_URL || 'http://localhost:8000',
  
  // Collection name for storing embeddings
  collectionName: process.env.CHROMA_COLLECTION_NAME || 'rag_documents',
  
  // Local persistence directory (used for local Docker volumes only)
  persistDirectory: process.env.VECTOR_DB_DIR || './storage/vector-db',
  
  // Optional: Authentication for cloud deployments
  apiKey: process.env.CHROMADB_API_KEY || '',
  
  // Optional: Tenant/database for multi-tenant cloud setups
  tenant: process.env.CHROMADB_TENANT || 'default_tenant',
  database: process.env.CHROMADB_DATABASE || 'default_database',
}));
