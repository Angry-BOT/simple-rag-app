import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase().slice(1);
}

/**
 * Get file type directory name based on extension
 */
export function getFileTypeDirectory(extension: string): string {
  const validTypes = ['pdf', 'txt', 'html'];
  return validTypes.includes(extension) ? extension : 'other';
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName);
  const baseName = path.basename(originalName, `.${extension}`);
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${sanitizedName}_${timestamp}.${extension}`;
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Delete file safely
 */
export async function deleteFileSafely(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
}
