/**
 * File-related type definitions
 */

export interface FileMetadata {
  id: string;
  originalName: string;
  storedName: string;
  fileType: string;
  size: number;
  path: string;
  uploadedAt: string;
}

export interface FileResponse {
  id: string;
  originalName: string;
  storedName: string;
  fileType: string;
  size: number;
  path: string;
  uploadedAt: string;
}

export interface IngestionResult {
  fileId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  originalDocCount: number;
  chunkCount: number;
  embeddingTimeMs: number;
  storageTimeMs: number;
  totalTimeMs: number;
  status: 'success' | 'failed';
  error?: string;
}

