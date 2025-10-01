/**
 * File entity representing uploaded file metadata
 */
export class FileEntity {
  id: string;
  originalName: string;
  filename: string;
  fileType: string;
  size: number;
  path: string;
  uploadedAt: Date;

  constructor(partial: Partial<FileEntity>) {
    Object.assign(this, partial);
  }
}
