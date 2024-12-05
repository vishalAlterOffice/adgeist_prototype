import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('advertiser')
@UseGuards(AuthGuard('jwt'))
export class AdvertiserController {
  constructor() {}
}
