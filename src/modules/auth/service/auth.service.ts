import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from 'src/modules/user/services/users.service';
import User from 'src/modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import Token from 'src/modules/user/entities/token.entity';
import * as argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { UserGoogleProfile } from 'src/shared/interfaces/google_profile.interface';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
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

  private async generateTokens(
    userId: number,
    existingRefreshToken?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      },
    );

    const refreshToken = existingRefreshToken
      ? existingRefreshToken
      : await this.jwtService.signAsync(
          { id: userId },
          {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
          },
        );

    const refreshTokenHash = await this.hashToken(refreshToken);

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      user_name: username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenRecords = await this.tokenRepository.find({
      where: { user: { id: userId } },
    });

    const tokenRecord = await tokenRecords.find(async (token) =>
      argon2.verify(token.refreshToken, refreshToken),
    );

    if (!tokenRecord) {
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

  async logout(userId: number): Promise<void> {
    await this.tokenRepository.delete({ user: { id: userId } });
  }

  async googleIdTokenAuth(
    idToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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
