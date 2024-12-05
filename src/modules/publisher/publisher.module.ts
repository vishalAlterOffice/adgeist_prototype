import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from '../company/entities/company.entity';
import UserRepository from '../user/repositories/user.repository';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './services/publisher.service';
import User from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [PublisherController],
  providers: [PublisherService, UserRepository],
})
export class PublisherModule {}
