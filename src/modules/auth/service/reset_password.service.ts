import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { suid } from 'rand-token';
import * as argon2 from 'argon2';
import UserRepository from 'src/modules/user/repositories/user.repository';
import ForgotPasswordRepository from '../repositories/forgot_password.repository';
import ForgotPassword from '../entities/forgot_password.entity';
import User from 'src/modules/user/entities/user.entity';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly forgotPasswordRepository: ForgotPasswordRepository,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(email: string): Promise<string> {
    // Find mail for user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not registered.');
    }

    // Check existing user
    const existingRequest = await this.forgotPasswordRepository.findOne({
      email,
    });
    const currentTime = new Date();

    // Check if token not expired/ or used
    if (
      existingRequest &&
      !this.isTokenExpired(existingRequest.expiry) &&
      !existingRequest.isUsed
    ) {
      throw new BadRequestException('A reset token has already been sent.');
    }

    // Create a random uuid token
    const token = suid(128);
    const expiry = new Date(currentTime.getTime() + 5 * 60 * 1000); // 5 mint expiry

    // Create and update the token based on existence
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

    // generating Url
    const resetUrl = `https://www.example.com/reset-password?token=${token}`;
    console.log('url is', resetUrl);

    // Sending the notification over mail
    await this.mailService.sendForgotPasswordEmail(email, resetUrl);

    return 'A password reset link has been sent to your email address.';
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    // Find user based on token
    const resetRequest = await this.forgotPasswordRepository.findOne({ token });

    // check is token expired or used already
    if (
      !resetRequest ||
      this.isTokenExpired(resetRequest.expiry) ||
      resetRequest.isUsed
    ) {
      throw new BadRequestException('Invalid or expired token.');
    }

    // check if mail exists for the token
    const user = await this.userRepository.findByEmail(resetRequest.email);
    if (!user) {
      throw new BadRequestException('No user found for this token.');
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    // start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update the password for user
      await queryRunner.manager.update(User, user.id, {
        password: hashedPassword,
      });

      // update the status of token to used
      await queryRunner.manager.update(ForgotPassword, resetRequest.id, {
        isUsed: true,
      });

      await queryRunner.commitTransaction();
      return 'Password reset successful.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'An error occurred while resetting your password.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // Helper: for checking expiry date
  private isTokenExpired(expiry: Date): boolean {
    return new Date() > expiry;
  }
}
