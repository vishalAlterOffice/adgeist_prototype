import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/user/services/users.service';
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
    await this.ensureUserDoesNotExist(email);

    const existingOtp = await this.otpRepository.findOne({ where: { email } });
    const newOTP = generateOTP();
    const expiryDate = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 minutes

    if (existingOtp) {
      if (existingOtp.isVerified) {
        throw new BadRequestException(
          'Email already verified, try registration',
        );
      }

      if (existingOtp.expiry > new Date()) {
        const timeLeft = Math.ceil(
          (existingOtp.expiry.getTime() - Date.now()) / 1000,
        );
        throw new BadRequestException(
          `OTP already sent, wait ${timeLeft} seconds before requesting a new OTP`,
        );
      }

      await this.otpRepository.update(existingOtp.id, {
        otp: newOTP,
        expiry: expiryDate,
        isVerified: false,
      });
    } else {
      await this.createAndSaveOtp(email, newOTP, expiryDate);
    }

    await this.mailService.sendOtpEmail(email, newOTP);
    return 'OTP sent to your email successfully';
  }

  async verifyOTP(email: string, otp: number): Promise<string> {
    await this.ensureUserDoesNotExist(email);

    const existingOtp = await this.otpRepository.findOne({ where: { email } });
    if (!existingOtp) {
      throw new BadRequestException('OTP not found, please request a new one');
    }

    this.validateOtp(existingOtp, otp);

    await this.otpRepository.update(existingOtp.id, { isVerified: true });
    return 'Email verified successfully';
  }

  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
  }

  private async createAndSaveOtp(
    email: string,
    otp: number,
    expiryDate: Date,
  ): Promise<void> {
    const newOtpEntity = this.otpRepository.create({
      email,
      otp,
      expiry: expiryDate,
    });
    await this.otpRepository.save(newOtpEntity);
  }

  private validateOtp(existingOtp: OTP, otp: number): void {
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
  }
}
