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
import { AdvertiserDto } from './dto/advertiser.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Public } from '../auth/auth.decorator';
import { sendResponse } from 'src/shared/util/sendResponse';

@Controller('advertiser')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class AdvertiserController {
  constructor(private advertiserService: AdvertiserService) {}

  @Get(':id')
  @Public()
  async get(@Param('id') id: number, @Request() req: any) {
    const advertiser = await this.advertiserService.getAdvertiserById(id);
    return sendResponse(true, 'Advertiser details', advertiser);
  }

  @Post(':id')
  async create(
    @Param('id') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Request() req: any,
  ) {
    const newAdvertiser = await this.advertiserService.create(
      companyId,
      advertiserDto,
      req.user,
    );
    return sendResponse(true, 'Advertiser created', newAdvertiser);
  }

  @Patch(':id')
  async update(
    @Param('id') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Req() req: any,
  ) {
    const updatedAdvertiser = await this.advertiserService.update(
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
