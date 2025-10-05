import { Module } from '@nestjs/common';
import { DocumentParserService } from './parsers/document-parser.service';
import { SemanticChunkerService } from './chunking/semantic-chunker.service';
import { HuggingFaceEmbeddingsService } from './embeddings/huggingface-embeddings.service';
import { ChromaStoreService } from './vector-store/chroma-store.service';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { FilesModule } from '../files/files.module';

/**
 * Module for document ingestion and processing
 */
@Module({
  imports: [FilesModule],
  controllers: [IngestionController],
  providers: [
    DocumentParserService,
    SemanticChunkerService,
    HuggingFaceEmbeddingsService,
    ChromaStoreService,
    IngestionService,
  ],
  exports: [
    DocumentParserService,
    SemanticChunkerService,
    HuggingFaceEmbeddingsService,
    ChromaStoreService,
    IngestionService,
  ],
})
export class IngestionModule {}
