import { apiClient } from './api.service';
import type { FileResponse, IngestionResult } from '../types/file.types';

/**
 * Files API service
 * Handles all file-related API calls
 */
export const filesApi = {
  /**
   * Upload a file to the server
   * @param file File to upload
   * @returns Promise with file metadata
   */
  uploadFile: async (file: File): Promise<FileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<FileResponse>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Get all uploaded files
   * @returns Promise with array of file metadata
   */
  getFiles: async (): Promise<FileResponse[]> => {
    const { data } = await apiClient.get<{ files: FileResponse[]; total: number }>('/api/files');
    return data.files; // Extract the files array from the response object
  },

  /**
   * Delete a file by ID
   * @param id File ID to delete
   * @returns Promise that resolves when file is deleted
   */
  deleteFile: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/files/${id}`);
  },

  /**
   * Process a file through the ingestion pipeline
   * @param id File ID to process
   * @returns Promise with ingestion result
   */
  processFile: async (id: string): Promise<IngestionResult> => {
    const { data } = await apiClient.post<IngestionResult>(`/api/ingestion/process/${id}`);
    return data;
  },
};

