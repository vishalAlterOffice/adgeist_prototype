import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/modules/auth/auth.decorator';
import * as jwt from 'jsonwebtoken';

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
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    // Validate refresh_token if provided
    // const refreshToken = req.headers['x-refresh-token'];
    // if (refreshToken) {
    //   try {
    //     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    //     req.refresh_token = refreshToken; // Attach to request if needed later
    //   } catch (tokenError) {
    //     throw new UnauthorizedException(
    //       'Refresh token expired, please log in again.',
    //     );
    //   }
    // }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    console.log('Authenticated user:', req.user);

    return userWithoutPassword;
  }
}
