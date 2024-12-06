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
import UserCompanyRoleRepository from '../company/repositories/userCompanyRole.repository';
import UserCompanyRole from '../user/entities/user_companyRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User, Publisher, UserCompanyRole]),
  ],
  controllers: [PublisherController],
  providers: [
    PublisherService,
    UserRepository,
    PublisherRepository,
    CompanyRepository,
    UserCompanyRoleRepository,
  ],
})
export class PublisherModule {}
