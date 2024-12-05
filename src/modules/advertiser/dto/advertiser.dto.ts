import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class AdvertiserDto {
  @IsNotEmpty()
  @IsString()
  marketingHandledBy: string;

  @IsNotEmpty()
  @IsString()
  annualRevenue: string;

  @IsNotEmpty()
  @IsString()
  marketingBudget: string;

  @IsNotEmpty()
  @IsUrl()
  website_url: string;
}
