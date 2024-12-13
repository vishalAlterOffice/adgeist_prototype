import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/user/services/users.service';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import OTP from '../entities/otp.entity';
import { generateOTP } from '../util/otp_generater';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class OTPService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly mailService: MailService,
  ) {}

  async sendOtp(email: string): Promise<string> {
    // Check if user already exists
    const isUserExists = await this.userService.findByEmail(email);
    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    // Generate new OTP
    const newOTP = generateOTP();
    const expiryDate = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const existingOtp = await this.otpRepository.findOne({ where: { email } });

    if (existingOtp) {
      if (existingOtp.isVerified) {
        throw new BadRequestException(
          'Email already verified try to registration',
        );
      }
      await this.otpRepository.update(existingOtp.id, {
        otp: newOTP,
        expiry: expiryDate,
        isVerified: false,
      });
    } else {
      const newOtpEntity = this.otpRepository.create({
        email,
        otp: newOTP,
        expiry: expiryDate,
        created_At: new Date(),
      });
      await this.otpRepository.save(newOtpEntity);
    }

    // Send OTP via email
    await this.mailService.sendOtpEmail(email, newOTP);

    return 'OTP sent to your email successfully';
  }

  async verifyOTP(email: string, otp: number): Promise<string> {
    // Check if user already exists
    const isUserExists = await this.userService.findByEmail(email);
    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    // Check OTP existence and validity
    const existingOtp = await this.otpRepository.findOne({ where: { email } });
    if (!existingOtp) {
      throw new BadRequestException('OTP not found, please request a new one');
    }

    if (existingOtp.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (existingOtp.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (new Date() > existingOtp.expiry) {
      throw new BadRequestException(
        'OTP has expired, please request a new one',
      );
    }

    // Mark OTP as verified
    await this.otpRepository.update(existingOtp.id, { isVerified: true });

    return 'Email verified successfully';
  }
}
