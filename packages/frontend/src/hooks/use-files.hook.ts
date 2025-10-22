import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '../services/files.service';
import { queryKeys } from '../lib/query-keys';
import type { FileResponse } from '../types/file.types';

/**
 * Hook to fetch all files
 * Uses React Query for caching and automatic refetching
 */
export const useFiles = () => {
  return useQuery({
    queryKey: queryKeys.files.all,
    queryFn: filesApi.getFiles,
  });
};

/**
 * Hook to upload a file
 * Invalidates files query on success
 */
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
    },
  });
};

/**
 * Hook to delete a file
 * Implements optimistic updates for better UX
 */
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: filesApi.deleteFile,
    // Optimistic update: immediately remove from UI
    onMutate: async (fileId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.files.all });

      // Snapshot the previous value
      const previousFiles = queryClient.getQueryData<FileResponse[]>(queryKeys.files.all);

      // Optimistically update to the new value
      queryClient.setQueryData<FileResponse[]>(queryKeys.files.all, (old) =>
        old?.filter((f) => f.id !== fileId)
      );

      // Return context with the previous value
      return { previousFiles };
    },
    // Rollback on error
    onError: (err, fileId, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(queryKeys.files.all, context.previousFiles);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
    },
  });
};

/**
 * Hook to process a file through the ingestion pipeline
 */
export const useProcessFile = () => {
  return useMutation({
    mutationFn: filesApi.processFile,
  });
};

