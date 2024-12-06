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
import { AdvertiserTypes } from 'src/shared/util/roles';

// Custom validator to validate roles
@ValidatorConstraint({ name: 'isValidType', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  validate(types: string[], args: ValidationArguments): boolean {
    return (
      Array.isArray(types) &&
      types.every((type) => AdvertiserTypes.includes(type))
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `Each type must be one of the following: ${AdvertiserTypes.join(
      ', ',
    )}`;
  }
}

export class AdvertiserDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one type must be provided' })
  @Validate(IsValidRole, {
    message: `Each type must be one of the following: ${AdvertiserTypes.join(
      ', ',
    )}`,
  })
  marketingHandledBy: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(100000)
  annualRevenue: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(100000)
  marketingBudget: number;

  @IsNotEmpty()
  @IsUrl()
  website_url: string;
}
