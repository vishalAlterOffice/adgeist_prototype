import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { suid } from 'rand-token';
import * as argon2 from 'argon2';
import User from 'src/modules/user/entities/user.entity';
import ForgotPassword from '../entities/forgot_password.entity';
import { MailService } from 'src/modules/mail/mail.service';
import ForgotPasswordRepository from '../repositories/forgot_password.repository';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly forgotPasswordRepository: ForgotPasswordRepository,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(email: string): Promise<string> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Email not exists');
    }

    const existingRequest = await this.forgotPasswordRepository.findOne({
      email,
    });
    this.checkExistingRequest(existingRequest);

    const { token, expiry } = this.generateResetToken();
    await this.saveOrUpdateForgotPasswordRequest(
      existingRequest,
      email,
      token,
      expiry,
    );

    const resetUrl = this.generateResetUrl(token);
    await this.mailService.sendForgotPasswordEmail(email, resetUrl);

    return 'A password reset link has been sent to your email address.';
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const resetRequest = await this.forgotPasswordRepository.findOne({ token });
    this.validateResetRequest(resetRequest);

    const user = await this.findUserByEmail(resetRequest.email);
    await this.updatePasswordAndMarkTokenUsed(user, resetRequest, newPassword);

    return 'Password reset successful.';
  }

  async deleteExpiredTokens() {
    await this.forgotPasswordRepository.deleteExpiredTokens();
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not registered.');
    }
    return user;
  }

  private checkExistingRequest(existingRequest: ForgotPassword | null): void {
    if (
      existingRequest &&
      !this.isTokenExpired(existingRequest.expiry) &&
      !existingRequest.isUsed
    ) {
      throw new BadRequestException('A reset token has already been sent.');
    }
  }

  private generateResetToken(): { token: string; expiry: Date } {
    const token = suid(128);
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    return { token, expiry };
  }

  private async saveOrUpdateForgotPasswordRequest(
    existingRequest: ForgotPassword | null,
    email: string,
    token: string,
    expiry: Date,
  ): Promise<void> {
    const currentTime = new Date();

    if (existingRequest) {
      await this.forgotPasswordRepository.update(existingRequest.id, {
        token,
        expiry,
        isUsed: false,
        created_At: currentTime,
      });
    } else {
      await this.forgotPasswordRepository.save({
        email,
        token,
        expiry,
        isUsed: false,
        created_At: currentTime,
      });
    }
  }

  private generateResetUrl(token: string): string {
    return `https://www.example.com/reset-password?token=${token}`;
  }

  private validateResetRequest(resetRequest: ForgotPassword | null): void {
    if (
      !resetRequest ||
      this.isTokenExpired(resetRequest.expiry) ||
      resetRequest.isUsed
    ) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }

  private async updatePasswordAndMarkTokenUsed(
    user: User,
    resetRequest: ForgotPassword,
    newPassword: string,
  ): Promise<void> {
    const hashedPassword = await argon2.hash(newPassword);
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, user.id, {
        password: hashedPassword,
      });
      await queryRunner.manager.update(ForgotPassword, resetRequest.id, {
        isUsed: true,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'An error occurred while resetting your password.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  private isTokenExpired(expiry: Date): boolean {
    return new Date() > expiry;
  }
}
