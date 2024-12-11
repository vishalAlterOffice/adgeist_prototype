import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CompanyDto } from '../dto/company.dto';
import Company from '../entities/company.entity';
import CompanyRepository from '../repositories/company.repository';
import UserRepository from 'src/modules/user/repositories/user.repository';
import User from 'src/modules/user/entities/user.entity';
import RoleRepository from 'src/shared/repositories/role.repository';
import UserCompanyRoleRepository from '../repositories/userCompanyRole.repository';
import { DataSource, QueryRunner } from 'typeorm';
import UserCompanyRole from 'src/modules/user/entities/user_companyRole.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userCompanyRoleRepository: UserCompanyRoleRepository,
    private readonly dataSource: DataSource,
  ) {}

  // Create a new company with transaction
  async create(
    companyDto: CompanyDto,
    user: User,
  ): Promise<{ company: Partial<Company> }> {
    // Start a new query runner
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check for duplicate GST number
      const existingCompany = await this.companyRepository.findOne({
        GST_No: companyDto.GST_No,
      });
      if (existingCompany) {
        throw new BadRequestException('GST number already exists');
      }

      // Create a new company
      const companyEntity = queryRunner.manager.create(Company, companyDto);
      const newCompany = await queryRunner.manager.save(companyEntity);

      // Assign the user as ADMIN for the created company
      const adminRole = await this.roleRepository.findOne({
        role_name: 'ADMIN',
      });
      if (!adminRole) {
        throw new NotFoundException('ADMIN role not found');
      }

      const userCompanyRole = queryRunner.manager.create(UserCompanyRole, {
        user,
        company: newCompany,
        roles: [adminRole],
      });
      await queryRunner.manager.save(userCompanyRole);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return { company: newCompany };
    } catch (error) {
      // Rollback the transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  // Update a company (only allowed for ADMIN users of the company)
  async update(
    companyId: number,
    companyDto: Partial<CompanyDto>,
  ): Promise<{ company: Partial<Company> }> {
    // Check for duplicate GST number
    await this.ensureUniqueGST(companyDto.GST_No, companyId);

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
  async getAllCompany(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ company: Company[]; totalPages: number }> {
    const allCompanies = await this.companyRepository.getAllWithRelation(
      ['advertiser', 'publisher'],
      page,
      limit,
    );

    const totalPages = Math.ceil(allCompanies.length / limit);

    return {
      company: allCompanies,
      totalPages,
    };
  }

  // Get company by ID
  async getCompanyById(companyId: number): Promise<{ company: Company }> {
    const companyDetails = await this.companyRepository.findOneByRelation(
      companyId,
      ['advertiser', 'publisher', 'userCompanyRoles', 'userCompanyRoles.user'],
    );

    if (!companyDetails) {
      throw new NotFoundException('Company not found');
    }

    // Delete password of user
    if (companyDetails.userCompanyRoles) {
      companyDetails.userCompanyRoles.map((user) => {
        if (user.user.password) {
          delete user.user.password;
        }
      });
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
    const targetUser = await this.userRepository.findOne({ id: targetUserId });
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Fetch roles by names
    const roles = await this.roleRepository.findByNames(roleNames);
    if (!roles.length) {
      throw new NotFoundException('Roles not found');
    }

    // Fetch the user-company-role relation
    let userCompanyRoleRecord =
      await this.userCompanyRoleRepository.findWithRelations(
        { user: { id: targetUserId }, company: { id: companyId } },
        ['roles'],
      );

    // If the relation exists, update roles
    if (userCompanyRoleRecord) {
      const existingRoleNames = userCompanyRoleRecord.roles.map(
        (role) => role.role_name,
      );

      // Filter out roles that are already assigned
      const newRoles = roles.filter(
        (role) => !existingRoleNames.includes(role.role_name),
      );

      if (newRoles.length === 0) {
        return {
          message: `User already has the roles: ${roleNames.join(', ')}`,
        };
      }

      // Append new roles and save
      userCompanyRoleRecord.roles = [
        ...userCompanyRoleRecord.roles,
        ...newRoles,
      ];
      await this.userCompanyRoleRepository.save(userCompanyRoleRecord);
    } else {
      // Create a new user-company-role relation
      userCompanyRoleRecord = await this.userCompanyRoleRepository.create({
        user: targetUser,
        company: { id: companyId } as Company,
        roles,
      });
      await this.userCompanyRoleRepository.save(userCompanyRoleRecord);
    }

    return {
      message: `User assigned roles: ${roleNames.join(', ')} successfully`,
    };
  }

  // Helper

  // Validate Unique GST Number
  private async ensureUniqueGST(
    GST_No: string,
    excludeCompanyId?: number,
  ): Promise<void> {
    const existingCompany = await this.companyRepository.findOne({ GST_No });

    if (
      existingCompany &&
      (!excludeCompanyId || existingCompany.id !== excludeCompanyId)
    ) {
      throw new BadRequestException('GST number already exists');
    }
  }
}
