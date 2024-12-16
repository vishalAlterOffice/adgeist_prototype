import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ForgotPasswordService } from 'src/modules/auth/service/reset_password.service';

@Injectable()
export class CronService {
  constructor(private resetPasswordService: ForgotPasswordService) {}
  // private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron() {
    console.log('Running Cron job for deletion of Expired token');
    await this.resetPasswordService.deleteExpiredTokens();
  }
}
