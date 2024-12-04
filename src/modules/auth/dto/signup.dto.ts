import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsEmail,
} from 'class-validator';
import { defaultRoles } from 'src/shared/util/roles';

// Custom validator to validate roles
@ValidatorConstraint({ name: 'isValidRole', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  // private readonly allowedRoles = ['ADMIN', 'USER'];

  validate(roles: string[], args: ValidationArguments): boolean {
    return (
      Array.isArray(roles) && roles.every((role) => defaultRoles.includes(role))
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `Each role must be one of the following: ${defaultRoles.join(', ')}`;
  }
}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one role must be provided' })
  @Validate(IsValidRole, { message: 'Role must be either ADMIN or USER' })
  roles: string[];
}
