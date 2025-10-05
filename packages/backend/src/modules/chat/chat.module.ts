import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiService } from '../llm/gemini.service';
import { IngestionModule } from '../ingestion/ingestion.module';

/**
 * Module for chat/Q&A functionality with RAG
 */
@Module({
  imports: [IngestionModule],
  controllers: [ChatController],
  providers: [ChatService, GeminiService],
  exports: [ChatService, GeminiService],
})
export class ChatModule {}
