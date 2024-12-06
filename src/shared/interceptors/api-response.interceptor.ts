import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_GLOBAL_INTERCEPTOR_KEY } from '../decorators/skip-global-interceptor.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.get<boolean>(
      SKIP_GLOBAL_INTERCEPTOR_KEY,
      context.getHandler(),
    );

    if (skip) {
      return next.handle(); // Skip the global interceptor for this route
    }
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: data.message || 'Operation successful',
        data: data.data !== undefined ? data.data : null,
      })),
    );
  }
}
