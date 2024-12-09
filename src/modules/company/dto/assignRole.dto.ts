import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { defaultRoles, RoleName } from 'src/shared/util/roles';

// Custom validator to validate roles
@ValidatorConstraint({ name: 'isValidRole', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  validate(roles: string[], args: ValidationArguments): boolean {
    return (
      Array.isArray(roles) && roles.every((role) => defaultRoles.includes(role))
    );
  }
}

export class AssignRoleDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
  })
  targetUserId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one role must be provided' })
  @Validate(IsValidRole, {
    message: `Each role must be one of the following: ${defaultRoles.join(', ')}`,
  })
  @ApiProperty({
    example: [RoleName.MEMBER],
  })
  roleName: RoleName[];
}
