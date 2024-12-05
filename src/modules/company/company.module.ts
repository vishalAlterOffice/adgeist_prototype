import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from '../company/entities/company.entity';
import UserRepository from '../user/repositories/user.repository';
import { CompanyController } from './company.controller';
import { CompanyService } from './services/company.service';
import User from '../user/entities/user.entity';
import Advertiser from '../advertiser/entities/advertiser.entity';
import Publisher from '../publisher/entities/publisher.entity';
import CompanyRepository from './repositories/company.repository';
import RoleRepository from 'src/shared/repositories/role.repository';
import UserCompanyRoleRepository from './repositories/userCompanyRole.repository';
import Role from 'src/shared/entities/roles.entity';
import UserCompanyRole from '../user/entities/user_companyRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Advertiser,
      Publisher,
      Role,
      UserCompanyRole,
    ]),
  ],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    UserRepository,
    CompanyRepository,
    RoleRepository,
    UserCompanyRoleRepository,
  ],
})
export class CompanyModule {}
