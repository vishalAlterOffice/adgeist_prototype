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

@Controller('advertiser')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class AdvertiserController {
  constructor(private advertiserService: AdvertiserService) {}

  @Get(':id')
  @Public()
  get(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<{ advertiser: Partial<Advertiser> }> {
    return this.advertiserService.getAdvertiserById(id);
  }

  @Post(':id')
  create(
    @Param('companyId') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Request() req: any,
  ): Promise<{ advertiser: Partial<Advertiser> }> {
    return this.advertiserService.create(companyId, advertiserDto, req.user);
  }

  @Patch(':id')
  async update(
    @Param('companyId') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Req() req: any,
  ) {
    return this.advertiserService.update(companyId, advertiserDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: number, @Req() req: any) {
  //   const user = req.user;
  //   return this.advertiserService.delete(id, user);
  // }
}
