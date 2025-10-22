/**
 * Chat-related type definitions
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceDocument[];
  timestamp: Date;
}

export interface SourceDocument {
  fileName: string;
  fileType: string;
  chunkIndex?: number;
  relevanceScore?: number;
  excerpt?: string;
}

export interface ChatQuery {
  question: string;
  topK?: number;
}

export interface ChatResponse {
  answer: string;
  question: string;
  sources: SourceDocument[];
  responseTimeMs: number;
  model: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthStatus {
  gemini: boolean;
  ingestion: boolean;
  overall: boolean;
}

