import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PublisherTypes } from 'src/shared/util/roles';

// Custom validator to validate roles
@ValidatorConstraint({ name: 'isValidRole', async: false })
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
  type: string[];

  @IsNotEmpty()
  @IsString()
  curr_monthly_revenue: string;

  @IsNotEmpty()
  @IsString()
  expected_revenue: string;

  @IsNotEmpty()
  @IsString()
  own_ad_space: string;

  @IsNotEmpty()
  @IsUrl()
  website_url: string;
}
