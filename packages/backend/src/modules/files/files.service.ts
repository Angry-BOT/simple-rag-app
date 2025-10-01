import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  getFileExtension,
  getFileTypeDirectory,
  generateUniqueFilename,
  ensureDirectoryExists,
  deleteFileSafely,
} from '../../common/utils/file.utils';
import { FileEntity } from './entities/file.entity';
import { FileResponseDto, FileListResponseDto } from './dto';

/**
 * Service for managing file uploads and storage
 */
@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir: string;
  private readonly allowedFileTypes: string[];
  private readonly maxFileSize: number;
  private readonly fileRegistry: Map<string, FileEntity> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('file.uploadDir') || './storage/uploads';
    this.allowedFileTypes = this.configService.get<string[]>('file.allowedFileTypes') || [
      'pdf',
      'txt',
      'html',
    ];
    this.maxFileSize = this.configService.get<number>('file.maxFileSize') || 10485760;
    void this.initializeStorage();
  }

  /**
   * Initialize storage directories
   */
  private async initializeStorage(): Promise<void> {
    try {
      await ensureDirectoryExists(this.uploadDir);
      for (const fileType of this.allowedFileTypes) {
        const typeDir = path.join(this.uploadDir, fileType);
        await ensureDirectoryExists(typeDir);
      }
      this.logger.log('Storage directories initialized');
    } catch (error) {
      this.logger.error('Failed to initialize storage directories', error);
    }
  }

  /**
   * Upload and store a file
   */
  async uploadFile(file: Express.Multer.File): Promise<FileResponseDto> {
    this.logger.log(`Uploading file: ${file.originalname}`);

    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const extension = getFileExtension(file.originalname);
    const uniqueFilename = generateUniqueFilename(file.originalname);
    const fileTypeDir = getFileTypeDirectory(extension);
    const filePath = path.join(this.uploadDir, fileTypeDir, uniqueFilename);

    // Ensure directory exists
    const fileDir = path.dirname(filePath);
    await ensureDirectoryExists(fileDir);

    // Save file to disk
    await fs.writeFile(filePath, file.buffer);

    // Create file entity
    const fileEntity = new FileEntity({
      id: uuidv4(),
      originalName: file.originalname,
      filename: uniqueFilename,
      fileType: extension,
      size: file.size,
      path: filePath,
      uploadedAt: new Date(),
    });

    // Store in registry
    this.fileRegistry.set(fileEntity.id, fileEntity);

    this.logger.log(`File uploaded successfully: ${fileEntity.id}`);

    return this.mapToResponseDto(fileEntity);
  }

  /**
   * Get all uploaded files
   */
  getAllFiles(): FileListResponseDto {
    const files = Array.from(this.fileRegistry.values()).map((file) => this.mapToResponseDto(file));

    return {
      files,
      total: files.length,
    };
  }

  /**
   * Get file by ID
   */
  getFileById(id: string): FileResponseDto {
    const file = this.fileRegistry.get(id);

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return this.mapToResponseDto(file);
  }

  /**
   * Delete file by ID
   */
  async deleteFile(id: string): Promise<void> {
    const file = this.fileRegistry.get(id);

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    // Delete file from disk
    const deleted = await deleteFileSafely(file.path);

    if (!deleted) {
      this.logger.warn(`Failed to delete file from disk: ${file.path}`);
    }

    // Remove from registry
    this.fileRegistry.delete(id);

    this.logger.log(`File deleted: ${id}`);
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file type
    const extension = getFileExtension(file.originalname);
    if (!this.allowedFileTypes.includes(extension)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${this.allowedFileTypes.join(', ')}`,
      );
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize} bytes`,
      );
    }
  }

  /**
   * Map file entity to response DTO
   */
  private mapToResponseDto(file: FileEntity): FileResponseDto {
    return {
      id: file.id,
      originalName: file.originalName,
      filename: file.filename,
      fileType: file.fileType,
      size: file.size,
      path: file.path,
      uploadedAt: file.uploadedAt.toISOString(),
    };
  }
}
