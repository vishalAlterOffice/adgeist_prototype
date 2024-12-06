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
import { PublisherService } from './services/publisher.service';
import { PublisherDto } from './dto/publisher.dto';
import Publisher from './entities/publisher.entity';
import { Public } from '../auth/auth.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { sendResponse } from 'src/shared/util/sendResponse';

@Controller('publisher')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class PublisherController {
  constructor(private publisherService: PublisherService) {}

  @Get(':id')
  @Public()
  async get(@Param('id') id: number, @Request() req: any) {
    const publisher = await this.publisherService.getPublisherById(id);
    return sendResponse(true, 'Publisher details', publisher);
  }

  @Post(':id')
  async create(
    @Param('id') companyId: number,
    @Body() publisherDto: PublisherDto,
    @Request() req: any,
  ) {
    const newPublisher = await this.publisherService.create(
      companyId,
      publisherDto,
      req.user,
    );
    return sendResponse(true, 'Publisher created', newPublisher);
  }

  @Patch(':id')
  async update(
    @Param('id') companyId: number,
    @Body() publisherDto: PublisherDto,
    @Req() req: any,
  ) {
    const user = req.user;
    const updatedPublisher = await this.publisherService.update(
      companyId,
      publisherDto,
    );
    return sendResponse(true, 'Publisher Updated', updatedPublisher);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: number, @Req() req: any) {
  //   return this.publisherService.delete(id);
  // }
}
