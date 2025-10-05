import { Controller, Post, Param, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { FilesService } from '../files/files.service';

/**
 * Controller for document ingestion operations
 */
@ApiTags('ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Trigger ingestion for a specific file
   */
  @Post('process/:fileId')
  @ApiOperation({
    summary: 'Process file into vector store',
    description:
      'Triggers the ingestion pipeline for an uploaded file: parse → chunk → embed → store in ChromaDB',
  })
  @ApiParam({
    name: 'fileId',
    description: 'ID of the uploaded file to process',
    example: 'a4b27b0f-6976-4d87-90a1-5273371a1506',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File processed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'File processed successfully' },
        fileId: { type: 'string', example: 'a4b27b0f-6976-4d87-90a1-5273371a1506' },
        fileName: { type: 'string', example: 'document.pdf' },
        status: { type: 'string', example: 'completed' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ingestion failed',
  })
  async processFile(@Param('fileId') fileId: string): Promise<{
    message: string;
    fileId: string;
    fileName: string;
    status: string;
  }> {
    // Get file metadata
    const fileMetadata = this.filesService.getFileById(fileId);

    // Trigger ingestion pipeline
    await this.ingestionService.ingestFile(
      fileMetadata.path,
      fileMetadata.fileType,
      fileId,
      fileMetadata.originalName,
    );

    return {
      message: 'File processed successfully',
      fileId: fileId,
      fileName: fileMetadata.originalName,
      status: 'completed',
    };
  }

  /**
   * Get ingestion pipeline health status
   */
  @Get('health')
  @ApiOperation({
    summary: 'Check ingestion pipeline health',
    description: 'Returns the health status of all ingestion pipeline components',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        parser: { type: 'boolean' },
        chunker: { type: 'boolean' },
        embeddings: { type: 'boolean' },
        vectorStore: { type: 'boolean' },
        overall: { type: 'boolean' },
      },
    },
  })
  getHealth(): {
    parser: boolean;
    chunker: boolean;
    embeddings: boolean;
    vectorStore: boolean;
    overall: boolean;
  } {
    return this.ingestionService.getHealthStatus();
  }
}

