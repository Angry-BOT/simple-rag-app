import { registerAs } from '@nestjs/config';

/**
 * RAG (Retrieval-Augmented Generation) configuration
 */
export const ragConfig = registerAs('rag', () => ({
  chunkSize: parseInt(process.env.CHUNK_SIZE || '512', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '50', 10),
  topKResults: parseInt(process.env.TOP_K_RESULTS || '5', 10),
  llmModel: process.env.LLM_MODEL || 'gemini-pro',
  llmTemperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  llmMaxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2048', 10),
}));
