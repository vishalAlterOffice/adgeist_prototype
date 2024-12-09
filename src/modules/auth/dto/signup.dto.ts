import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'The username of the user',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password for the user account',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
