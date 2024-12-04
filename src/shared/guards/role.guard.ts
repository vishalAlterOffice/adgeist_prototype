import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/modules/auth/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    let requiredRoles;
    try {
      // Fetch required roles for the route
      requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    } catch (error) {
      console.log('ERR', error);
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // If no roles are specified, allow access
    }
    // Extract user from request
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || !user.roles) {
      return false; // Deny access if user or roles are missing
    }

    // Validate user roles against the required roles
    const userRoles = user.roles.map((role: any) => role.role_name || role); // Support `role_name` or raw role strings
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    return hasRole; // Allow access if user has at least one required role
  }
}
