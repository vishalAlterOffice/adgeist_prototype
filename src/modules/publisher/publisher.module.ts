import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from '../company/entities/company.entity';
import UserRepository from '../user/repositories/user.repository';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './services/publisher.service';
import User from '../user/entities/user.entity';
import Publisher from './entities/publisher.entity';
import PublisherRepository from './repositories/publisher.repository';
import CompanyRepository from '../company/repositories/company.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, Publisher])],
  controllers: [PublisherController],
  providers: [
    PublisherService,
    UserRepository,
    PublisherRepository,
    CompanyRepository,
  ],
})
export class PublisherModule {}
