import { registerAs } from '@nestjs/config';

/**
 * File upload configuration
 */
export const fileConfig = registerAs('file', () => ({
  uploadDir: process.env.UPLOAD_DIR || './storage/uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,txt,html').split(','),
}));
