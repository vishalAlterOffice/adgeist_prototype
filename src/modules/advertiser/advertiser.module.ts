import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from '../company/entities/company.entity';
import { AdvertiserService } from './services/advertiser.service';
import UserRepository from '../user/repositories/user.repository';
import { AdvertiserController } from './advertiser.controller';
import User from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [AdvertiserController],
  providers: [AdvertiserService, UserRepository],
})
export class AdvertiserModule {}
