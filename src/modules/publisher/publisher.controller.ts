import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('publisher')
@UseGuards(AuthGuard('jwt'))
export class PublisherController {
  constructor() {}
}
