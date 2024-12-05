import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from 'src/shared/entities/roles.entity';
import User from './entities/user.entity';
import UserRepository from './repositories/user.repository';
import { UsersService } from './services/users.service';
import UserCompanyRole from './entities/user_companyRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserCompanyRole])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
