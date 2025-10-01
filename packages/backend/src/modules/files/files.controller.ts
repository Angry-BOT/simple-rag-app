import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileResponseDto, FileListResponseDto, UploadFileDto } from './dto';

/**
 * Controller for file upload and management operations
 */
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Upload a new file
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Upload a PDF, TXT, or HTML file to the knowledge base',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: UploadFileDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or file type not allowed',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'File size exceeds maximum allowed size',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileResponseDto> {
    return this.filesService.uploadFile(file);
  }

  /**
   * Get all uploaded files
   */
  @Get()
  @ApiOperation({
    summary: 'Get all files',
    description: 'Retrieve a list of all uploaded files',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of files retrieved successfully',
    type: FileListResponseDto,
  })
  getAllFiles(): FileListResponseDto {
    return this.filesService.getAllFiles();
  }

  /**
   * Get file by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get file by ID',
    description: 'Retrieve information about a specific file',
  })
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: 'f7b3d4e2-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File information retrieved successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found',
  })
  getFileById(@Param('id') id: string): FileResponseDto {
    return this.filesService.getFileById(id);
  }

  /**
   * Delete file by ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete file',
    description: 'Delete a file from the knowledge base',
  })
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: 'f7b3d4e2-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'File deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found',
  })
  async deleteFile(@Param('id') id: string): Promise<void> {
    return this.filesService.deleteFile(id);
  }
}
