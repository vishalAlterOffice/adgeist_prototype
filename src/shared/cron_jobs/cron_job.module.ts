import { Module } from '@nestjs/common';
import { ForgotPasswordService } from 'src/modules/auth/service/reset_password.service';
import { CronService } from './cron_job.service';
import UserRepository from 'src/modules/user/repositories/user.repository';
import { UsersModule } from 'src/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/modules/user/entities/user.entity';
import ForgotPassword from 'src/modules/auth/entities/forgot_password.entity';
import ForgotPasswordRepository from 'src/modules/auth/repositories/forgot_password.repository';
import { MailService } from 'src/modules/mail/mail.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, ForgotPassword])],
  controllers: [],
  providers: [
    CronService,
    ForgotPasswordService,
    UserRepository,
    ForgotPasswordRepository,
    MailService,
  ],
})
export class CronJobModule {}
