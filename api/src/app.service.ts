import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string { return 'Hello from API!'; }

  // Example Cron (every minute)
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.log('Cron is running every minute');
  }
}