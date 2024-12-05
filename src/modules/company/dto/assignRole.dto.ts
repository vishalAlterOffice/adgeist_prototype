import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsNumber()
  targetUserId: number;

  @IsNotEmpty()
  @IsString()
  roleName: 'ADMIN' | 'MEMBER';
}
