import { SetMetadata } from '@nestjs/common';

export const SKIP_GLOBAL_INTERCEPTOR_KEY = 'skipGlobalInterceptor';
export const SkipGlobalInterceptor = () =>
  SetMetadata(SKIP_GLOBAL_INTERCEPTOR_KEY, true);
