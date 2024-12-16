import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from 'src/modules/user/services/users.service';
import User from 'src/modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { UserGoogleProfile } from 'src/shared/interfaces/google_profile.interface';
import OTPRepository from '../repositories/otp.repository';
import { AuthUtil } from '../util/auth.util';
import TokenRepository from '../repositories/token.repository';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
    private otpRepository: OTPRepository,
    private authUtil: AuthUtil,
    private tokenRepository: TokenRepository,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new Error('Google client ID is not configured');
    }
    this.googleClient = new OAuth2Client(clientId);
  }

  private async hashToken(token: string): Promise<string> {
    return argon2.hash(token);
  }

  private async generateTokens(userId: number, existingRefreshToken?: string) {
    const accessToken = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_JWT_EXPIRES'),
      },
    );

    const refreshToken = existingRefreshToken
      ? existingRefreshToken
      : await this.jwtService.signAsync(
          { id: userId },
          {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_JWT_EXPIRES'),
          },
        );

    const refreshTokenHash =
      await this.authUtil.encryptWithStaticSalt(refreshToken);

    await this.tokenRepository.save({
      user: { id: userId },
      refreshToken: refreshTokenHash,
    });

    return { accessToken, refreshToken };
  }

  async signUp(signUpDto: SignUpDto): Promise<{ user: Partial<User> }> {
    const { email, username, password } = signUpDto;

    if (await this.userService.findByEmail(email)) {
      throw new BadRequestException('Email already exists');
    }

    const isEmailVerified = await this.otpRepository.findOne({ email });

    // TODO: check here for google auth verification
    if (!isEmailVerified || !isEmailVerified.isVerified) {
      throw new BadRequestException('Verify this email first using OTP');
    }

    const hashedPassword = await this.hashToken(password);

    const newUser = await this.userService.createUser({
      user_name: username,
      email,
      password: hashedPassword,
      googleId: '',
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (user && !user.password && user.googleId) {
      throw new UnauthorizedException('Login with Google');
    }

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const hashToken = await this.authUtil.encryptWithStaticSalt(refreshToken);
    const tokenRecords = await this.tokenRepository.findOne({
      refreshToken: hashToken,
    });

    if (!tokenRecords) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      const errorMessage =
        error.name === 'TokenExpiredError'
          ? 'Refresh token expired. Please login again.'
          : 'Invalid refresh token';
      throw new UnauthorizedException(errorMessage);
    }

    return this.generateTokens(userId, refreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    const hashRefreshToken =
      await this.authUtil.encryptWithStaticSalt(refreshToken);
    console.log('hashToken', hashRefreshToken);
    await this.tokenRepository.deleteRefreshToken(hashRefreshToken);
  }

  async googleIdTokenAuth(idToken: string) {
    const payload = await this.verifyGoogleIdToken(idToken);
    const googleUser: UserGoogleProfile = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      picture: payload.picture,
    };
    return this.oAuth(googleUser);
  }

  private async verifyGoogleIdToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google ID token');
    }
    return payload;
  }

  private async oAuth(googleUser: UserGoogleProfile) {
    let user = await this.userService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.userService.createUser({
        email: googleUser.email,
        user_name: googleUser.name,
        googleId: googleUser.googleId,
        password: '',
      });
    } else if (!user.googleId) {
      await this.userService.updateUser(user.id, {
        googleId: googleUser.googleId,
      });
    }
    return this.generateTokens(user.id);
  }

  async handleGoogleCallback(googleUser: UserGoogleProfile): Promise<string> {
    const { accessToken, refreshToken } = await this.oAuth(googleUser);
    return `https://example.com?accessToken=${accessToken}&refreshToken=${refreshToken}`;
  }
}
