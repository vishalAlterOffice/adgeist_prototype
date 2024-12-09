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

    if (!user || !companyId) {
      throw new ForbiddenException('Invalid access');
    }

    // Fetch roles of the user for the company
    const userCompanyRoles =
      await this.userCompanyRoleRepository.findManyWithRelations(
        {
          user: { id: user.id },
          company: { id: companyId },
        },
        ['roles'],
      );

    if (!userCompanyRoles || userCompanyRoles.length === 0) {
      throw new ForbiddenException('You do not have access to this company');
    }

    // Flatten roles into a single array of role names
    const userRoles = userCompanyRoles.flatMap(
      (ucr) => ucr.roles?.map((role) => role.role_name) || [],
    );

    // Check if the user has at least one of the required roles
    const hasRequiredRole = userRoles.includes('ADMIN');

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'You do not have the required permissions to access this resource.',
      );
    }

    return true;
  }
}
