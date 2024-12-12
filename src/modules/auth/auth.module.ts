import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import User from '../user/entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import UserRepository from '../user/repositories/user.repository';
import { UsersService } from '../user/services/users.service';
import Role from 'src/shared/entities/roles.entity';
import Token from '../user/entities/token.entity';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Role, Token]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    UserRepository,
    GoogleStrategy,
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
