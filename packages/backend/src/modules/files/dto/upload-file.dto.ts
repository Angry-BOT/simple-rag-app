import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for file upload
 */
export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (PDF, TXT, or HTML)',
    example: 'document.pdf',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}

/**
 * Response DTO for uploaded file
 */
export class FileResponseDto {
  @ApiProperty({
    description: 'Unique file identifier',
    example: 'f7b3d4e2-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
  })
  @IsString()
  originalName: string;

  @ApiProperty({
    description: 'Stored filename',
    example: 'document_1234567890.pdf',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'File type/extension',
    example: 'pdf',
  })
  @IsString()
  fileType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'File path on server',
    example: 'storage/uploads/pdf/document_1234567890.pdf',
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2025-09-29T12:00:00.000Z',
  })
  @IsString()
  uploadedAt: string;
}

/**
 * Response DTO for file list
 */
export class FileListResponseDto {
  @ApiProperty({
    type: [FileResponseDto],
    description: 'List of uploaded files',
  })
  files: FileResponseDto[];

  @ApiProperty({
    description: 'Total number of files',
    example: 10,
  })
  total: number;
}
