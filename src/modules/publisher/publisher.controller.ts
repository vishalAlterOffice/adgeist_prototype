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

@Controller('publisher')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class PublisherController {
  constructor(private publisherService: PublisherService) {}

  @Get(':id')
  @Public()
  get(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<{ publisher: Partial<Publisher> }> {
    return this.publisherService.getPublisherById(id);
  }

  @Post(':id')
  create(
    @Param('companyId') companyId: number,
    @Body() publisherDto: PublisherDto,
    @Request() req: any,
  ): Promise<{ publisher: Partial<Publisher> }> {
    return this.publisherService.create(companyId, publisherDto, req.user);
  }

  @Patch(':id')
  async update(
    @Param('companyId') companyId: number,
    @Body() publisherDto: PublisherDto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.publisherService.update(companyId, publisherDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: number, @Req() req: any) {
  //   return this.publisherService.delete(id);
  // }
}
