import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './shared/database/database.module';
import { SeedsModule } from './shared/seed/seed.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { AdvertiserModule } from './modules/advertiser/advertiser.module';

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
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().default('3600s'),
      }),
    }),
    DatabaseModule,
    SeedsModule,
    UsersModule,
    AuthModule,
    CompanyModule,
    AdvertiserModule,
    PublisherModule,
  ],
})
export class AppModule {}
