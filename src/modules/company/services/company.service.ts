import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CompanyDto } from '../dto/company.dto';
import Company from '../entities/company.entity';
import CompanyRepository from '../repositories/company.repository';
import UserRepository from 'src/modules/user/repositories/user.repository';
import User from 'src/modules/user/entities/user.entity';
import RoleRepository from 'src/shared/repositories/role.repository';
import UserCompanyRoleRepository from '../repositories/userCompanyRole.repository';
import { FindOptionsWhere } from 'typeorm';
import Role from 'src/shared/entities/roles.entity';

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
    const isCompanyExists = await this.companyRepository.findOne({
      GST_No: companyDto.GST_No,
    });

    if (isCompanyExists) {
      throw new BadRequestException('GST number already exists');
    }

    // Create a new company
    const newCompany = await this.companyRepository.create(companyDto);

    // Assign the user as ADMIN for the created company
    const adminRole = await this.roleRepository.findOne({
      role_name: 'ADMIN',
    });
    if (!adminRole) {
      throw new NotFoundException('ADMIN role not found');
    }

    await this.userCompanyRoleRepository.create({
      user: user,
      company: newCompany,
      roles: [adminRole],
    });

    return { company: newCompany };
  }

  // Update a company (only allowed for ADMIN users of the company)
  async update(
    companyId: number,
    companyDto: Partial<CompanyDto>,
    user: User,
  ): Promise<{ company: Partial<Company> }> {
    // Check for duplicate GST number
    const existingCompany = await this.companyRepository.findOne({
      GST_No: companyDto.GST_No,
    });

    if (
      existingCompany &&
      existingCompany.id !== companyId // Ensure the existing company is not the same as the one being updated
    ) {
      throw new BadRequestException('GST number already exists');
    }

    // Update the company
    const updatedCompany = await this.companyRepository.update(
      companyId,
      companyDto,
    );

    if (!updatedCompany) {
      throw new NotFoundException('Failed to update company');
    }

    return { company: updatedCompany };
  }

  // Delete a company (only allowed for ADMIN users of the company)
  async delete(companyId: number, user: User): Promise<{ message: string }> {
    // Delete the company
    await this.companyRepository.destroy(companyId);

    return { message: 'Company deleted successfully' };
  }

  // Get all companies
  async getAllCompany(): Promise<{ company: Company[] }> {
    const companyDetails = await this.companyRepository.getAllWithRelation([
      'advertiser',
      'publisher',
      'userCompanyRoles',
      'userCompanyRoles.user', // Include nested relation for users
    ]);

    return { company: companyDetails };
  }

  // Get company by ID
  async getCompanyById(
    companyId: number,
    user: User,
  ): Promise<{ company: Company }> {
    const companyDetails = await this.companyRepository.findOneByRelation(
      companyId,
      ['advertiser', 'publisher', 'user'],
    );

    if (!companyDetails) {
      throw new NotFoundException('Company not found');
    }

    return { company: companyDetails };
  }

  // Assign a role to another user for the company
  async assignRole(
    companyId: number,
    targetUserId: number,
    roleNames: string[],
  ): Promise<{ message: string }> {
    // Validate if the target user exists
    const targetUser = await this.userRepository.get(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Fetch roles by names
    const roles = await this.roleRepository.findByNames(roleNames);
    if (!roles.length) {
      throw new NotFoundException('Roles not found');
    }

    // Check if a user-company-role relation exists
    let userCompanyRoleRecord =
      await this.userCompanyRoleRepository.findWithRelations(
        { user: { id: targetUserId }, company: { id: companyId } },
        ['roles'],
      );

    if (userCompanyRoleRecord) {
      // Update existing roles
      const updatedRoles = { roles };
      userCompanyRoleRecord =
        await this.userCompanyRoleRepository.save(updatedRoles);
    } else {
      // Create a new user-company-role relation
      userCompanyRoleRecord = await this.userCompanyRoleRepository.create({
        user: targetUser,
        company: { id: companyId } as Company,
        roles,
      });
    }

    return {
      message: `User assigned roles: ${roleNames.join(', ')} successfully`,
    };
  }
}
