import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/module/auth/auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Skip JWT validation for public routes
    }

    return super.canActivate(context); // Perform JWT validation for protected routes
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    // Attach the authenticated user to the request object
    const req = context.switchToHttp().getRequest();
    const { password, ...userWithoutPassword } = user;

    req.user = userWithoutPassword;
    // console.log('user is', user);
    console.log('jwtAuth user', req.user);

    return userWithoutPassword;
  }
}
