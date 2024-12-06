import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdvertiserService } from './services/advertiser.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AdvertiserDto } from './dto/advertiser.dto';
import Advertiser from './entities/advertiser.entity';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Public } from '../auth/auth.decorator';
import { sendResponse } from 'src/shared/util/sendResponse';

@Controller('advertiser')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class AdvertiserController {
  constructor(private advertiserService: AdvertiserService) {}

  @Get(':id')
  @Public()
  get(@Param('id') id: number, @Request() req: any) {
    const advertiser = this.advertiserService.getAdvertiserById(id);
    return sendResponse(true, 'Advertiser details', advertiser);
  }

  @Post(':id')
  create(
    @Param('id') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Request() req: any,
  ) {
    const createdAdvertiser = this.advertiserService.create(
      companyId,
      advertiserDto,
      req.user,
    );
    return sendResponse(true, 'Advertiser created', createdAdvertiser);
  }

  @Patch(':id')
  async update(
    @Param('companyId') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Req() req: any,
  ) {
    const updatedAdvertiser = this.advertiserService.update(
      companyId,
      advertiserDto,
    );
    return sendResponse(true, 'Advertiser updated', updatedAdvertiser);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: number, @Req() req: any) {
  //   const user = req.user;
  //   return this.advertiserService.delete(id, user);
  // }
}
