import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import User from '../user/entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import UserRepository from '../user/repositories/user.repository';
import { UsersService } from '../user/services/users.service';
import Role from 'src/shared/entities/roles.entity';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthController } from './controllers/auth.controller';
import Token from './entities/token.entity';
import OTP from './entities/otp.entity';
import ForgotPassword from './entities/forgot_password.entity';
import OTPRepository from './repositories/otp.repository';
import { OTPService } from './service/otp.service';
import { ForgotPasswordService } from './service/reset_password.service';
import ForgotPasswordRepository from './repositories/forgot_password.repository';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Role, Token, OTP, ForgotPassword]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    UserRepository,
    GoogleStrategy,
    OTPRepository,
    OTPService,
    ForgotPasswordService,
    ForgotPasswordRepository,
    MailService,
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
