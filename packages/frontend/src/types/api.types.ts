/**
 * General API-related type definitions
 */

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface FileListResponse {
  files: any[];
  total: number;
}

