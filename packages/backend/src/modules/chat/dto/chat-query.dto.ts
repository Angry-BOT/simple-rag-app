import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

/**
 * DTO for chat query request
 */
export class ChatQueryDto {
  @ApiProperty({
    description: 'The question or message from the user',
    example: 'What are the main features of the product?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Number of relevant documents to retrieve (default: 5)',
    example: 5,
    required: false,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  topK?: number;
}

/**
 * Source document information in chat response
 */
export class SourceDocumentDto {
  @ApiProperty({
    description: 'Name of the source file',
    example: 'product-manual.pdf',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'Type of the source file',
    example: 'pdf',
  })
  @IsString()
  fileType: string;

  @ApiProperty({
    description: 'Chunk index in the source document',
    example: 3,
  })
  @IsNumber()
  chunkIndex: number;

  @ApiProperty({
    description: 'Relevance score (0-1, higher is more relevant)',
    example: 0.85,
  })
  @IsNumber()
  relevanceScore: number;

  @ApiProperty({
    description: 'Excerpt from the source document',
    example: 'The product features include...',
  })
  @IsString()
  excerpt: string;
}

/**
 * DTO for chat query response
 */
export class ChatResponseDto {
  @ApiProperty({
    description: 'The generated answer from the AI',
    example:
      'The main features include advanced analytics, real-time monitoring, and automated reporting.',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'The original question',
    example: 'What are the main features of the product?',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Array of source documents used to generate the answer',
    type: [SourceDocumentDto],
  })
  sources: SourceDocumentDto[];

  @ApiProperty({
    description: 'Time taken to generate the response (in milliseconds)',
    example: 1250,
  })
  @IsNumber()
  responseTimeMs: number;

  @ApiProperty({
    description: 'Name of the LLM model used',
    example: 'gemini-1.5-pro',
  })
  @IsString()
  model: string;
}
