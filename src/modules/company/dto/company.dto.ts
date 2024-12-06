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
  company_name: string;

  @IsNotEmpty()
  @IsString()
  GST_No: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  pin_code: number;

  @IsNotEmpty()
  @IsString()
  industry: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'Contact number must be 10 digits long' })
  @Matches(/^[6-9]\d{9}$/, {
    message:
      'Contact number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9',
  })
  contact_no: string;
}
