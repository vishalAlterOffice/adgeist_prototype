import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from '../company/entities/company.entity';
import { AdvertiserService } from './services/advertiser.service';
import UserRepository from '../user/repositories/user.repository';
import { AdvertiserController } from './advertiser.controller';
import User from '../user/entities/user.entity';
import AdvertiserRepository from './repositories/advertiser.repository';
import CompanyRepository from '../company/repositories/company.repository';
import Advertiser from './entities/advertiser.entity';
import UserCompanyRoleRepository from '../company/repositories/userCompanyRole.repository';
import UserCompanyRole from '../user/entities/user_companyRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User, Advertiser, UserCompanyRole]),
  ],
  controllers: [AdvertiserController],
  providers: [
    AdvertiserService,
    UserRepository,
    AdvertiserRepository,
    CompanyRepository,
    UserCompanyRoleRepository,
  ],
})
export class AdvertiserModule {}
