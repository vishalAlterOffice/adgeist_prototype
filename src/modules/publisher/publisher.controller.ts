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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { PublisherDto } from './dto/publisher.dto';
import Publisher from './entities/publisher.entity';
import Role from 'src/shared/entities/roles.entity';

@Controller('publisher')
@UseGuards(AuthGuard('jwt'))
export class PublisherController {
  constructor(private publisherService: PublisherService) {}

  @Get(':id')
  @Roles()
  get(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<{ publisher: Partial<Publisher> }> {
    return this.publisherService.getPublisherById(id);
  }

  @Post(':id')
  @Roles()
  create(
    @Param('id') id: number,
    @Body() publisherDto: PublisherDto,
    @Request() req: any,
  ): Promise<{ publisher: Partial<Publisher> }> {
    return this.publisherService.create(id, publisherDto, req.user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() publisherDto: PublisherDto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.publisherService.update(id, publisherDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: any) {
    return this.publisherService.delete(id);
  }
}
