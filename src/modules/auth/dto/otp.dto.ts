import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class OTPDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The otp for the email verification',
    minLength: 6,
  })
  @IsNotEmpty()
  @Min(100000)
  @Max(999999)
  otp?: number;
}
