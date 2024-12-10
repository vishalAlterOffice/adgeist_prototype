import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Public } from '../auth/auth.decorator';
import { CompanyService } from './services/company.service';
import { AdvertiserService } from './services/advertiser.service';
import { PublisherService } from './services/publisher.service';
import { sendResponse } from 'src/shared/util/sendResponse';
import { CompanyDto } from './dto/company.dto';
import { AssignRoleDto } from './dto/assignRole.dto';
import { AdvertiserDto } from './dto/advertiser.dto';
import { PublisherDto } from './dto/publisher.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('company')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly advertiserService: AdvertiserService,
    private readonly publisherService: PublisherService,
  ) {}

  // Get all companies
  @Public()
  @Get('all')
  async getAllCompany(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const allCompany = await this.companyService.getAllCompany(page, limit);
    return sendResponse(true, 'All companies fetched successfully', allCompany);
  }

  // Get company by ID
  @Get(':id')
  @Roles('MEMBER', 'ADMIN')
  @UseGuards(RoleGuard)
  async getCompanyById(@Param('id') id: number, @Req() req: any) {
    const company = await this.companyService.getCompanyById(id, req.user);
    return sendResponse(true, 'Company details', company);
  }

  // Create new company
  @Post('')
  @Public()
  @ApiBody({ type: CompanyDto })
  async createCompany(@Body() companyDto: any, @Req() req: any) {
    const newCompany = await this.companyService.create(companyDto, req.user);
    return sendResponse(true, 'Company created', newCompany);
  }

  // Update existing company
  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBody({ type: CompanyDto })
  async updateCompany(
    @Param('id') id: number,
    @Body() companyDto: Partial<CompanyDto>,
    @Req() req: any,
  ) {
    const updatedCompany = await this.companyService.update(
      id,
      companyDto,
      req.user,
    );
    return sendResponse(true, 'Company updated', updatedCompany);
  }

  // Delete existing company
  // @Delete(':id')
  // @Roles('ADMIN')
  // @UseGuards(RoleGuard)
  // async deleteCompany(@Param('id') id: number, @Req() req: any) {
  //   await this.companyService.delete(id, req.user);
  //   return sendResponse(true, 'Company deleted successfully');
  // }

  // Assign role to other user ass ADMIN/MEMBER
  @Post(':id/assign-role')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBody({ type: AssignRoleDto })
  async assignRole(
    @Param('id') id: number,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    const updatedRoles = await this.companyService.assignRole(
      id,
      assignRoleDto.targetUserId,
      assignRoleDto.roleName,
    );
    return sendResponse(true, 'Role assigned successfully', updatedRoles);
  }

  // Get advertiser details by ID
  @Get('advertiser/:id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'MEMBER')
  async getAdvertiser(@Param('id') id: number, @Request() req: any) {
    const advertiser = await this.advertiserService.getAdvertiserById(id);
    return sendResponse(true, 'Advertiser details', advertiser);
  }

  // Create new advertiser for existing company
  @Post(':id/advertiser')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBody({ type: AdvertiserDto })
  async createAdvertiser(
    @Param('id') companyId: number,
    @Body() advertiserDto: AdvertiserDto,
    @Req() req: any,
  ) {
    const newAdvertiser = await this.advertiserService.createAdvertiser(
      companyId,
      advertiserDto,
      req.user,
    );
    return sendResponse(true, 'Advertiser created', newAdvertiser);
  }

  // Update advertiser for company
  @Patch(':id/advertiser')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBody({ type: AdvertiserDto })
  async updateAdvertiser(
    @Param('id') companyId: number,
    @Body() advertiserDto: Partial<AdvertiserDto>,
  ) {
    const updatedAdvertiser = await this.advertiserService.updateAdvertiser(
      companyId,
      advertiserDto,
    );
    return sendResponse(true, 'Advertiser updated', updatedAdvertiser);
  }

  /// Get publisher details by ID
  @Get('publisher/:id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'MEMBER')
  async getPublisher(@Param('id') id: number) {
    const publisher = await this.publisherService.getPublisherById(id);
    return sendResponse(true, 'Publisher details', publisher);
  }

  // Create new publisher for company
  @Post(':id/publisher')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBody({ type: PublisherDto })
  async createPublisher(
    @Param('id') companyId: number,
    @Body() publisherDto: PublisherDto,
    @Req() req: any,
  ) {
    const newPublisher = await this.publisherService.create(
      companyId,
      publisherDto,
      req.user,
    );
    return sendResponse(true, 'Publisher created', newPublisher);
  }

  // Update existing publisher
  @Patch(':id/publisher')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBody({ type: PublisherDto })
  async updatePublisher(
    @Param('id') companyId: number,
    @Body() publisherDto: Partial<PublisherDto>,
  ) {
    const updatedPublisher = await this.publisherService.update(
      companyId,
      publisherDto,
    );
    return sendResponse(true, 'Publisher updated', updatedPublisher);
  }
}
