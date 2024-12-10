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
import { CompanyService } from './services/company.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Public } from '../auth/auth.decorator';
import { sendResponse } from 'src/shared/util/sendResponse';
import { AssignRoleDto } from './dto/assignRole.dto';
import { AdvertiserDto } from './dto/advertiser.dto';
import { AdvertiserService } from './services/advertiser.service';
import { PublisherService } from './services/publisher.service';
import { PublisherDto } from './dto/publisher.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CompanyDto } from './dto/company.dto';

@Controller('company')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private advertiserService: AdvertiserService,
    private publisherService: PublisherService,
  ) {}

  @Public()
  @Get('all')
  async getAllCompany() {
    const allCompany = await this.companyService.getAllCompany();
    return sendResponse(true, 'All company fetched successfully', allCompany);
  }

  @Get(':id')
  @Roles('MEMBER', 'ADMIN') // Define required roles
  @UseGuards(RoleGuard)
  async getCompanyById(@Param('id') id: number, @Req() req: any) {
    const user = req.user;
    const company = await this.companyService.getCompanyById(id, user);
    return sendResponse(true, 'Company details', company);
  }

  @Post('')
  @Public()
  @ApiBody({ type: CompanyDto })
  async createCompany(@Body() companyDto: any, @Req() req: any) {
    const newCompany = await this.companyService.create(companyDto, req.user);
    return sendResponse(true, 'Company created', newCompany);
  }

  @Patch(':id')
  @Roles('ADMIN') // Only ADMIN can update
  @UseGuards(RoleGuard)
  @ApiBody({ type: CompanyDto })
  async updateCompany(
    @Param('id') id: number,
    @Body() companyDto: any,
    @Req() req: any,
  ) {
    const user = req.user;
    const updatedCompany = await this.companyService.update(
      id,
      companyDto,
      user,
    );
    return sendResponse(true, 'Company updated', updatedCompany);
  }

  @Delete(':id')
  @Roles('ADMIN') // Only ADMIN can delete
  @UseGuards(RoleGuard)
  async delete(@Param('id') id: number, @Req() req: any) {
    const user = req.user;
    return this.companyService.delete(id, user);
  }

  @Post(':id/assign-role')
  @Roles('ADMIN') // Only ADMIN can assign roles
  @UseGuards(RoleGuard)
  @ApiBody({ type: AssignRoleDto })
  async assignRole(
    @Param('id') id: number,
    @Body() assignRoleDto: AssignRoleDto,
    @Req() req: any,
  ) {
    const user = req.user;
    const updatedRoles = await this.companyService.assignRole(
      id,
      assignRoleDto.targetUserId,
      assignRoleDto.roleName,
    );

    return sendResponse(true, 'Role assigned successfully', updatedRoles);
  }

  @Get('advertiser/:id')
  @Public()
  async getAdvertiser(@Param('id') id: number, @Request() req: any) {
    const advertiser = await this.advertiserService.getAdvertiserById(id);
    return sendResponse(true, 'Advertiser details', advertiser);
  }

  @Post(':id/advertiser')
  @ApiBody({ type: AdvertiserDto })
  async createAdvertiser(
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

  @Patch(':id/advertiser')
  @ApiBody({ type: AdvertiserDto })
  async updateAdvertiser(
    @Param('id') companyId: number,
    @Body() advertiserDto: Partial<AdvertiserDto>,
    @Req() req: any,
  ) {
    const updatedAdvertiser = await this.advertiserService.update(
      companyId,
      advertiserDto,
    );
    return sendResponse(true, 'Advertiser updated', updatedAdvertiser);
  }

  @Get(':id/publisher')
  @Public()
  async getPublisher(@Param('id') id: number, @Request() req: any) {
    const publisher = await this.publisherService.getPublisherById(id);
    return sendResponse(true, 'Publisher details', publisher);
  }

  @Post(':id/publisher')
  @ApiBody({ type: PublisherDto })
  async createPublisher(
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

  @Patch(':id/publisher')
  @ApiBody({ type: PublisherDto })
  async updatePublisher(
    @Param('id') companyId: number,
    @Body() publisherDto: PublisherDto,
    @Req() req: any,
  ) {
    const updatedPublisher = await this.publisherService.update(
      companyId,
      publisherDto,
    );
    return sendResponse(true, 'Publisher Updated', updatedPublisher);
  }
}
