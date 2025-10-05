import { Controller, Post, Body, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatQueryDto, ChatResponseDto } from './dto/chat-query.dto';

/**
 * Controller for chat/Q&A interactions with the knowledge base
 */
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Query the knowledge base with a question
   * @param chatQuery The chat query
   */
  @Post('query')
  @ApiOperation({
    summary: 'Query the knowledge base',
    description:
      'Ask a question and get an AI-generated answer based on uploaded documents using RAG (Retrieval-Augmented Generation)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully generated response',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query or no documents in knowledge base',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to process query',
  })
  async query(@Body() chatQuery: ChatQueryDto): Promise<ChatResponseDto> {
    return this.chatService.query(chatQuery);
  }

  /**
   * Check if the chat service is ready
   */
  @Get('health')
  @ApiOperation({
    summary: 'Check chat service health',
    description:
      'Returns the health status of chat service components (Gemini LLM and ingestion pipeline)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        gemini: { type: 'boolean', description: 'Gemini LLM service status' },
        ingestion: { type: 'boolean', description: 'Ingestion pipeline status' },
        overall: { type: 'boolean', description: 'Overall chat service status' },
      },
    },
  })
  checkHealth(): {
    gemini: boolean;
    ingestion: boolean;
    overall: boolean;
  } {
    return this.chatService.isReady();
  }
}
