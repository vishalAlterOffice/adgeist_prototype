import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/modules/auth/auth.decorator';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import UserCompanyRoleRepository from 'src/modules/company/repositories/userCompanyRole.repository';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userCompanyRoleRepository: UserCompanyRoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const companyId = request.params.companyId || request.params.id;

    if (!user || !companyId) throw new ForbiddenException('Invalid access');

    // Fetch roles of the user for the company
    const userCompanyRole =
      await this.userCompanyRoleRepository.findWithRelations(
        {
          user: { id: user.id },
          company: { id: companyId },
        },
        ['roles'],
      );

    console.log('userCompanyRole', userCompanyRole);

    if (!userCompanyRole) {
      throw new ForbiddenException('You do not have access to this company');
    }
    const userRoles =
      userCompanyRole.roles?.map((role) => role.role_name) || [];

    if (!userRoles.includes('ADMIN')) {
      throw new ForbiddenException(
        'You do not have the required permissions to modify this resource.',
      );
    }

    return true;
  }
}
