import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  appConfig,
  fileConfig,
  vectorDbConfig,
  embeddingsConfig,
  ragConfig,
  llmConfig,
} from './common/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { FilesModule } from './modules/files/files.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';

/**
 * Root application module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, fileConfig, vectorDbConfig, embeddingsConfig, ragConfig, llmConfig],
    }),
    FilesModule,
    IngestionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
