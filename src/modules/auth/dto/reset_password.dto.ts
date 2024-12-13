import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '123456',
    description: 'The token for the forgot password',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password for the user account',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
