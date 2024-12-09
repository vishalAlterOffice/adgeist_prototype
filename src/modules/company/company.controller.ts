import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './services/company.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Public } from '../auth/auth.decorator';
import { sendResponse } from 'src/shared/util/sendResponse';
import { AssignRoleDto } from './dto/assignRole.dto';

@Controller('company')
@UseGuards(AuthGuard('jwt'))
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Public()
  @Get('all')
  async getAllCompany() {
    const allCompany = await this.companyService.getAllCompany();
    return sendResponse(true, 'All company fetched successfully', allCompany);
  }

  @Get(':id')
  @Roles('USER', 'ADMIN') // Define required roles
  @UseGuards(RoleGuard)
  async getCompanyById(@Param('id') id: number, @Req() req: any) {
    const user = req.user;
    const company = await this.companyService.getCompanyById(id, user);
    return sendResponse(true, 'Company details', company);
  }

  @Post('')
  @Public()
  async create(@Body() companyDto: any, @Req() req: any) {
    const newCompany = await this.companyService.create(companyDto, req.user);
    return sendResponse(true, 'Company created', newCompany);
  }

  @Patch(':id')
  @Roles('ADMIN') // Only ADMIN can update
  @UseGuards(RoleGuard)
  async update(
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
}
