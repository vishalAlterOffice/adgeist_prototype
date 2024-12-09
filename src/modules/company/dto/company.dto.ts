import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CompanyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'google',
  })
  company_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'BHCCDY9928880',
  })
  GST_No: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'xyz, abc',
  })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Bangalore',
  })
  city: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  @ApiProperty({
    example: 112233,
  })
  pin_code: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'IT',
  })
  industry: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'India',
  })
  country: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'Contact number must be 10 digits long' })
  @Matches(/^[6-9]\d{9}$/, {
    message:
      'Contact number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9',
  })
  @ApiProperty({
    example: 1234567890,
  })
  contact_no: string;
}
