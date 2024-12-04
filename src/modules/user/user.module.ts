import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/shared/entities/roles.entity';
import User from './entities/user.entity';
import { UsersService } from './service/users.service';
import UserRepository from './repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
