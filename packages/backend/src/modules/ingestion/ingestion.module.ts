import { Module } from '@nestjs/common';
import { DocumentParserService } from './parsers/document-parser.service';

/**
 * Module for document ingestion and processing
 */
@Module({
  providers: [DocumentParserService],
  exports: [DocumentParserService],
})
export class IngestionModule {}
