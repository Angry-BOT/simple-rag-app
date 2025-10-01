import { Injectable } from '@nestjs/common';

/**
 * Application root service
 */
@Injectable()
export class AppService {
  /**
   * Get application health status
   */
  getHealth(): { status: string; timestamp: string; service: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'RAG Application API',
    };
  }
}
