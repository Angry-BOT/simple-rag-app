import { apiClient } from './api.service';
import type { ChatQuery, ChatResponse, HealthStatus } from '../types/chat.types';

/**
 * Chat API service
 * Handles all chat-related API calls
 */
export const chatApi = {
  /**
   * Send a message to the RAG chat system
   * @param query Chat query with question and optional topK
   * @returns Promise with chat response
   */
  sendMessage: async (query: ChatQuery): Promise<ChatResponse> => {
    const { data } = await apiClient.post<ChatResponse>('/api/chat/query', query);
    return data;
  },

  /**
   * Get chat service health status
   * @returns Promise with health status
   */
  getChatHealth: async (): Promise<HealthStatus> => {
    const { data } = await apiClient.get<HealthStatus>('/api/chat/health');
    return data;
  },
};

