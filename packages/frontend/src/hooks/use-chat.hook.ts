import { useMutation, useQuery } from '@tanstack/react-query';
import { chatApi } from '../services/chat.service';
import { queryKeys } from '../lib/query-keys';

/**
 * Hook to send a message to the RAG chat system
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: chatApi.sendMessage,
  });
};

/**
 * Hook to get chat service health status
 * Automatically refetches every 30 seconds
 */
export const useChatHealth = () => {
  return useQuery({
    queryKey: queryKeys.chat.health,
    queryFn: chatApi.getChatHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

