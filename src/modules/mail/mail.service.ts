import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { forgotPasswordTemplate, sendOTPTemplate } from './templates/template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtpEmail(email: string, otp: number): Promise<void> {
    await this.mailerService.sendMail({
      from: this.configService.get<string>('MAIL_HOST'),
      to: email,
      subject: 'Your OTP Code',
      html: sendOTPTemplate(otp),
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: this.configService.get<string>('MAIL_HOST'),
      to: email,
      subject: 'Reset Your Password',
      html: forgotPasswordTemplate(resetLink),
    });
  }
}
