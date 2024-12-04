import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  roles: string[];
}
