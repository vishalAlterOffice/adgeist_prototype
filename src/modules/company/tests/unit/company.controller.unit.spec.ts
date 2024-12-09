import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../../company.controller';
import { AssignRoleDto } from '../../dto/assignRole.dto';
import { CompanyService } from '../../services/company.service';
import { CompanyDto } from '../../dto/company.dto';
import { RoleName } from 'src/shared/util/roles';

describe('CompanyController', () => {
  let companyController: CompanyController;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1 }),
            getAllCompany: jest.fn().mockResolvedValue([
              { id: 1, company_name: 'Company A' },
              { id: 2, company_name: 'Company B' },
            ]),
            getCompanyById: jest.fn().mockResolvedValue({
              id: 1,
              company_name: 'Company A',
            }),
            assignRole: jest.fn().mockResolvedValue({
              message: 'Role assigned successfully',
            }),
          },
        },
      ],
    }).compile();

    companyController = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  describe('createCompany', () => {
    it('should create a new company and return its ID', async () => {
      const createCompanyDto: CompanyDto = {
        company_name: 'Company A',
        GST_No: '123456',
        address: '123 Street',
        city: 'City',
        pin_code: 123456,
        industry: 'Tech',
        country: 'Country',
        contact_no: '9876543210',
      };

      const mockUser = { id: 1 }; // Mocked user object
      const req = { user: mockUser };

      const result = await companyController.createCompany(
        createCompanyDto,
        req,
      );

      expect(companyService.create).toHaveBeenCalledWith(
        createCompanyDto,
        mockUser,
      );
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getAllCompany', () => {
    it('should retrieve all companies', async () => {
      const result = await companyController.getAllCompany();

      expect(companyService.getAllCompany).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'All company fetched successfully',
        data: [
          { id: 1, company_name: 'Company A' },
          { id: 2, company_name: 'Company B' },
        ],
      });
    });
  });

  describe('getCompanyById', () => {
    it('should retrieve a company by ID', async () => {
      const companyId = 1;
      const mockUser = { id: 1 }; // Mocked user object
      const req = { user: mockUser };

      const result = await companyController.getCompanyById(companyId, req);

      expect(companyService.getCompanyById).toHaveBeenCalledWith(
        companyId,
        mockUser,
      );
      expect(result).toEqual({
        success: true,
        message: 'Company details',
        data: { id: 1, company_name: 'Company A' },
      });
    });
  });

  describe('assignRole', () => {
    it('should assign roles to a user in a company', async () => {
      const assignRoleDto: AssignRoleDto = {
        targetUserId: 2,
        roleName: [RoleName.MEMBER],
      };

      const companyId = 1;
      const mockUser = { id: 1 }; // Mocked user object
      const req = { user: mockUser };

      const result = await companyController.assignRole(
        companyId,
        assignRoleDto,
        req,
      );

      expect(companyService.assignRole).toHaveBeenCalledWith(
        companyId,
        assignRoleDto.targetUserId,
        assignRoleDto.roleName,
      );
      expect(result).toEqual({
        success: true,
        message: 'Role assigned successfully',
        data: { message: 'Role assigned successfully' },
      });
    });
  });
});
