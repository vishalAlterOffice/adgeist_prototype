import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoleName } from 'src/shared/util/roles';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsNumber()
  targetUserId: number;

  @IsNotEmpty()
  @IsEnum(RoleName, { message: 'Role must be ADMIN or MEMBER' })
  roleName: RoleName;
}
