import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthUtil {
  private readonly secretSalt: Buffer;

  constructor(private readonly config: ConfigService) {
    const saltValue = this.config.get<string>('HASH_SALT');
    if (!saltValue) {
      throw new Error('Environment variable "HASH_SALT" is missing');
    }
    this.secretSalt = Buffer.from(saltValue);
    if (this.secretSalt.length < 16) {
      throw new Error('HASH_SALT must be at least 16 bytes long');
    }
  }

  async encryptString(input: string): Promise<string> {
    return argon2.hash(input);
  }

  async encryptWithStaticSalt(input: string): Promise<string> {
    return argon2.hash(input, {
      salt: this.secretSalt,
      type: argon2.argon2id,
    });
  }

  async validateHash(
    encryptedData: string,
    plainData: string,
  ): Promise<boolean> {
    return argon2.verify(encryptedData, plainData);
  }
}
