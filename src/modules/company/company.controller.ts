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
import { CompanyDto } from './dto/company.dto';
import Company from './entities/company.entity';
import { CompanyService } from './services/company.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AssignRoleDto } from './dto/assignRole.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Public } from '../auth/auth.decorator';
import { sendResponse } from 'src/shared/util/sendResponse';

@Controller('company')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Public()
  @Get('all')
  async getAllCompany(@Req() req: any) {
    const allCompany = await this.companyService.getAllCompany();
    return sendResponse(true, 'All company fetched successfully', allCompany);
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: number, @Req() req: any) {
    const user = req.user;
    const company = await this.companyService.getCompanyById(id, user);
    return sendResponse(true, 'Company details', company);
  }

  @Post('')
  @Roles()
  @Public()
  async create(@Body() companyDto: CompanyDto, @Request() req: any) {
    const newCompany = await this.companyService.create(companyDto, req.user);
    return sendResponse(true, 'Company created', newCompany);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() companyDto: Partial<CompanyDto>,
    @Req() req: any,
  ) {
    const user = req.user;
    const updateCompany = await this.companyService.update(
      id,
      companyDto,
      user,
    );
    return sendResponse(true, 'Company updated', updateCompany);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: any) {
    const user = req.user;
    return this.companyService.delete(id, user);
  }

  @Post(':id/assign-role')
  async assignRole(
    @Param('id') companyId: number,
    @Body()
    assignRoleDto: AssignRoleDto,
    @Req() req: any,
  ) {
    const user = req.user;
    const updatedRoles = await this.companyService.assignRole(
      companyId,
      assignRoleDto.targetUserId,
      assignRoleDto.roleName,
      user,
    );

    return sendResponse(true, 'Role assigned successfully', updatedRoles);
  }
}
