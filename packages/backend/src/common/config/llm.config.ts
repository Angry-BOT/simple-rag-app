import { registerAs } from '@nestjs/config';

/**
 * LLM (Language Model) configuration
 */
export const llmConfig = registerAs('llm', () => ({
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  model: process.env.LLM_MODEL || 'gemini-pro',
  temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2048', 10),
}));
