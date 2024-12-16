import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './shared/database/database.module';
import { SeedsModule } from './shared/seed/seed.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './shared/interceptors/api-response.interceptor';
import { MailModule } from './modules/mail/mail.module';
import { MailService } from './modules/mail/mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from './shared/cron_jobs/cron_job.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DB: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        MYSQL_DB_TEST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        REFRESH_TOKEN_JWT_EXPIRES: Joi.string().default('1d'),
        ACCESS_TOKEN_JWT_EXPIRES: Joi.string().default('7d'),
      }),
    }),
    DatabaseModule,
    SeedsModule,
    UsersModule,
    AuthModule,
    CompanyModule,
    MailModule,
    CronJobModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    MailService,
  ],
})
export class AppModule {}
