import {
  Body,
  Controller,
  Delete,
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
import { RolesGuard } from 'src/shared/guards/role.guard';
import { AssignRoleDto } from './dto/assignRole.dto';

@Controller('company')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post('')
  @Roles()
  signUp(
    @Body() companyDto: CompanyDto,
    @Request() req: any,
  ): Promise<{ company: Partial<Company> }> {
    return this.companyService.create(companyDto, req.user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() companyDto: Partial<CompanyDto>,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.companyService.update(id, companyDto, user);
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
    return this.companyService.assignRole(
      companyId,
      assignRoleDto.targetUserId,
      assignRoleDto.roleName,
      user,
    );
  }
}
