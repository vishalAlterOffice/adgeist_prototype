import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserCompanyRoleRepository from 'src/modules/company/repositories/userCompanyRole.repository';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userCompanyRoleRepository: UserCompanyRoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const companyId = request.params.companyId || request.params.id;

    if (!user || !companyId) throw new ForbiddenException('Invalid access');

    // Check if the user has ADMIN access to the company
    const userCompanyRole = await this.userCompanyRoleRepository.findOne({
      user: { id: user.id },
      company: { id: companyId },
      role: { role_name: 'ADMIN' },
    });

    // If ADMIN role is found, grant full access
    if (userCompanyRole) {
      request.user.isAdmin = true;
      return true;
    }

    // Otherwise, allow only read access
    if (request.method !== 'GET')
      throw new ForbiddenException('Only read access is allowed');

    return true;
  }
}
