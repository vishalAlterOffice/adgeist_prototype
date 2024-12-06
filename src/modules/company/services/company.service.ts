import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CompanyDto } from '../dto/company.dto';
import Company from '../entities/company.entity';
import CompanyRepository from '../repositories/company.repository';
import UserRepository from 'src/modules/user/repositories/user.repository';
import User from 'src/modules/user/entities/user.entity';
import RoleRepository from 'src/shared/repositories/role.repository';
import UserCompanyRoleRepository from '../repositories/userCompanyRole.repository';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userCompanyRoleRepository: UserCompanyRoleRepository,
  ) {}

  // Create a new company
  async create(
    companyDto: CompanyDto,
    user: User,
  ): Promise<{ company: Partial<Company> }> {
    // Create a new company
    const newCompany = await this.companyRepository.create(companyDto);

    // Assign the user as ADMIN for the created company
    const adminRole = await this.roleRepository.findOne({ role_name: 'ADMIN' });
    if (!adminRole) throw new NotFoundException('ADMIN role not found');

    await this.userCompanyRoleRepository.create({
      user: user,
      company: newCompany,
      role: adminRole,
    });

    return { company: newCompany };
  }

  // Update a company (only allowed for ADMIN users of the company)
  async update(
    companyId: number,
    companyDto: Partial<CompanyDto>,
    user: User,
  ): Promise<{ company: Partial<Company> }> {
    // Check if the user is an ADMIN of the company
    const userCompanyRole = await this.userCompanyRoleRepository.findOne({
      user: { id: user.id },
      company: { id: companyId },
      role: { role_name: 'ADMIN' },
    });

    if (!userCompanyRole)
      throw new ForbiddenException(
        'You do not have permission to update this company',
      );

    // Update the company
    const updatedCompany = await this.companyRepository.update(
      companyId,
      companyDto,
    );
    if (!updatedCompany)
      throw new NotFoundException('Failed to update company');

    return { company: updatedCompany };
  }

  // Delete a company (only allowed for ADMIN users of the company)
  async delete(companyId: number, user: User): Promise<{ message: string }> {
    // Check if the user is an ADMIN of the company
    const userCompanyRole = await this.userCompanyRoleRepository.findOne({
      user: { id: user.id },
      company: { id: companyId },
      role: { role_name: 'ADMIN' },
    });

    if (!userCompanyRole)
      throw new ForbiddenException(
        'You do not have permission to delete this company',
      );

    // Delete the company
    await this.companyRepository.destroy(companyId);

    return { message: 'Company deleted successfully' };
  }

  // Get company by ID
  async getAllCompany(): Promise<{ company: Company[] }> {
    // Get the company
    const companyDetails = await this.companyRepository.getAllWithRelation([
      'advertiser',
      'publisher',
    ]);

    return { company: companyDetails };
  }

  // Get company by ID
  async getCompanyById(
    companyId: number,
    user: User,
  ): Promise<{ company: Company }> {
    // Get the company
    const companyDetails = await this.companyRepository.findOneByRelation(
      companyId,
      ['advertiser', 'publisher'],
    );

    return { company: companyDetails };
  }

  // Assign a role to another user for the company
  async assignRole(
    companyId: number,
    targetUserId: number,
    roleName: 'ADMIN' | 'MEMBER',
    user: User,
  ): Promise<{ message: string }> {
    // Check if the user is an ADMIN of the company
    const userCompanyRole = await this.userCompanyRoleRepository.findOne({
      user: { id: user.id },
      company: { id: companyId },
      role: { role_name: 'ADMIN' },
    });

    if (!userCompanyRole)
      throw new ForbiddenException(
        'You do not have permission to assign roles for this company',
      );

    // Check if the target user exists
    const targetUser = await this.userRepository.get(targetUserId);
    if (!targetUser) throw new NotFoundException('Target user not found');

    // Assign the role to the target user
    const role = await this.roleRepository.findOne({ role_name: roleName });
    if (!role) throw new NotFoundException(`${roleName} role not found`);

    const isAssignedRole = await this.userCompanyRoleRepository.findOne({
      user: targetUser,
    });

    if (isAssignedRole) {
      await this.userCompanyRoleRepository.update(isAssignedRole.id, {
        user: targetUser,
        company: { id: companyId } as Company,
        role,
      });
    } else {
      await this.userCompanyRoleRepository.create({
        user: targetUser,
        company: { id: companyId } as Company,
        role,
      });
    }
    return { message: `User assigned as ${roleName} successfully` };
  }
}
