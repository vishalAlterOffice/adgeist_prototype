import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PublisherTypes } from 'src/shared/util/roles';

// Custom validator to validate roles
@ValidatorConstraint({ name: 'isValidType', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  validate(roles: string[], args: ValidationArguments): boolean {
    return (
      Array.isArray(roles) &&
      roles.every((role) => PublisherTypes.includes(role))
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `Each type must be one of the following: ${PublisherTypes.join(
      ', ',
    )}`;
  }
}

export class PublisherDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one type must be provided' })
  @Validate(IsValidRole, {
    message: `Each type must be one of the following: ${PublisherTypes.join(
      ', ',
    )}`,
  })
  @ApiProperty({
    example: ['magazine'],
  })
  type: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(1000000)
  @ApiProperty({
    example: 39999,
  })
  curr_monthly_revenue: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    example: 89,
  })
  expected_revenue: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '21',
  })
  own_ad_space: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    example: 'www.google.com',
  })
  website_url: string;
}
