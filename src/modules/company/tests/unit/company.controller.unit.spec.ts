// Import statements
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CompanyController } from '../../company.controller';
import { CompanyService } from '../../services/company.service';
import { AdvertiserService } from '../../services/advertiser.service';
import { PublisherService } from '../../services/publisher.service';
import { AssignRoleDto } from '../../dto/assignRole.dto';
import { AdvertiserDto } from '../../dto/advertiser.dto';
import { PublisherDto } from '../../dto/publisher.dto';
import { RoleName } from 'src/shared/util/roles';
import { CompanyDto } from '../../dto/company.dto';

describe('CompanyController', () => {
  let controller: CompanyController;
  let companyService: CompanyService;
  let advertiserService: AdvertiserService;
  let publisherService: PublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            getAllCompany: jest.fn(),
            getCompanyById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            assignRole: jest.fn(),
          },
        },
        {
          provide: AdvertiserService,
          useValue: {
            getAdvertiserById: jest.fn(),
            createAdvertiser: jest.fn(),
            updateAdvertiser: jest.fn(),
          },
        },
        {
          provide: PublisherService,
          useValue: {
            getPublisherById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(jest.fn(() => true))
      .overrideGuard(RoleGuard)
      .useValue(jest.fn(() => true))
      .compile();

    controller = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
    advertiserService = module.get<AdvertiserService>(AdvertiserService);
    publisherService = module.get<PublisherService>(PublisherService);
  });

  // Tests for company routes (getAllCompany, getCompanyById, createCompany, updateCompany)

  // Advertiser routes
  describe('create Company', () => {
    it('should create a new company', async () => {
      const mockCompanyDto: CompanyDto = {
        company_name: 'google',
        GST_No: 'BHCCDY9928880',
        address: 'xyz, abc',
        city: 'Bangalore',
        pin_code: 112233,
        industry: 'IT',
        country: 'India',
        contact_no: '1234567890',
      };
      const mockCompany = {
        id: 1,
        advertiser: null,
        publisher: null,
        ...mockCompanyDto,
      };

      // jest
      //   .spyOn(advertiserService, 'createAdvertiser')
      //   .mockResolvedValue(mockAdvertiser);

      const result = await controller.createCompany(mockCompanyDto, 1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Company created');
    });
  });

  describe('assignRole', () => {
    it('should assign a role successfully', async () => {
      const mockAssignRoleDto: AssignRoleDto = {
        targetUserId: 1,
        roleName: [RoleName.ADMIN],
      };
      jest.spyOn(companyService, 'assignRole').mockResolvedValue({
        message: `User assigned roles: ADMIN successfully`,
      });

      const result = await controller.assignRole(1, mockAssignRoleDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Role assigned successfully');
    });

    it('should handle errors during role assignment', async () => {
      const mockAssignRoleDto: AssignRoleDto = {
        targetUserId: 100,
        roleName: [RoleName.ADMIN],
      };
      jest
        .spyOn(companyService, 'assignRole')
        .mockRejectedValue(new Error('Role assignment failed'));

      await expect(controller.assignRole(1, mockAssignRoleDto)).rejects.toThrow(
        'Role assignment failed',
      );
    });
  });

  // Advertiser routes
  describe('createAdvertiser', () => {
    it('should create a new advertiser', async () => {
      const mockAdvertiserDto: AdvertiserDto = {
        marketingHandledBy: ['agency'],
        annualRevenue: 20000,
        marketingBudget: 28000,
        website_url: 'www.google.com',
      };
      const mockAdvertiser = { id: 1, ...mockAdvertiserDto };

      // jest
      //   .spyOn(advertiserService, 'createAdvertiser')
      //   .mockResolvedValue(mockAdvertiser);

      const result = await controller.createAdvertiser(
        1,
        mockAdvertiserDto,
        {},
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Advertiser created');
    });

    it('should handle validation errors for advertiser creation', async () => {
      jest
        .spyOn(advertiserService, 'createAdvertiser')
        .mockRejectedValue(new Error('Validation failed'));

      const mockAdvertiserDto: AdvertiserDto = {
        marketingHandledBy: ['dfsdfsd'], // Value other than ENUMs
        annualRevenue: 1212,
        marketingBudget: 28000,
        website_url: 'www.google.com',
      };
      await expect(
        controller.createAdvertiser(1, mockAdvertiserDto, {}),
      ).rejects.toThrow('Validation failed');
    });
  });

  describe('updateAdvertiser', () => {
    it('should update an advertiser successfully', async () => {
      const mockAdvertiserDto: Partial<AdvertiserDto> = {
        marketingHandledBy: ['agency'],
        annualRevenue: 20000,
        marketingBudget: 28000,
        website_url: 'www.google.com',
      };
      const mockUpdatedAdvertiser = { id: 1, ...mockAdvertiserDto };

      // jest
      //   .spyOn(advertiserService, 'updateAdvertiser')
      //   .mockResolvedValue(mockUpdatedAdvertiser);

      const result = await controller.updateAdvertiser(1, mockAdvertiserDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Advertiser updated');
    });

    it('should handle advertiser not found', async () => {
      jest
        .spyOn(advertiserService, 'updateAdvertiser')
        .mockRejectedValue(new Error('Advertiser not found'));

      await expect(controller.updateAdvertiser(999, {})).rejects.toThrow(
        'Advertiser not found',
      );
    });
  });

  describe('createPublisher', () => {
    it('should create a publisher successfully', async () => {
      const mockPublisherDto: PublisherDto = {
        type: ['magazine'],
        curr_monthly_revenue: 39999,
        expected_revenue: 89,
        own_ad_space: '21',
        website_url: 'www.google.com',
      };
      const mockCreatedPublisher = { id: 1, ...mockPublisherDto };

      // jest
      //   .spyOn(publisherService, 'create')
      //   .mockResolvedValue(mockCreatedPublisher);

      const result = await controller.createPublisher(1, mockPublisherDto, {
        user: { id: 1 },
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Publisher created');
    });

    it('should handle errors during publisher creation', async () => {
      jest
        .spyOn(publisherService, 'create')
        .mockRejectedValue(new Error('Validation error'));

      await expect(
        controller.createPublisher(1, {} as PublisherDto, { user: { id: 1 } }),
      ).rejects.toThrow('Validation error');
    });
  });

  // Publisher routes
  describe('getPublisherById', () => {
    it('should return a publisher by ID', async () => {
      const mockPublisher = {
        type: ['magazine'],
        curr_monthly_revenue: 39999,
        expected_revenue: 89,
        own_ad_space: '21',
        website_url: 'www.google.com',
      };
      // jest
      //   .spyOn(publisherService, 'getPublisherById')
      //   .mockResolvedValue(mockPublisher);

      const result = await controller.getPublisher(1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Publisher details');
    });

    it('should handle publisher not found', async () => {
      jest
        .spyOn(publisherService, 'getPublisherById')
        .mockRejectedValue(new Error('Publisher not found'));

      await expect(controller.getPublisher(999)).rejects.toThrow(
        'Publisher not found',
      );
    });
  });

  describe('updatePublisher', () => {
    it('should update a publisher', async () => {
      const mockPublisherDto: Partial<PublisherDto> = {
        type: ['magazine'],
        curr_monthly_revenue: 39999,
        expected_revenue: 89,
        own_ad_space: '21',
        website_url: 'www.google.com',
      };
      const mockUpdatedPublisher = { id: 1, ...mockPublisherDto };

      // jest
      //   .spyOn(publisherService, 'update')
      //   .mockResolvedValue(mockUpdatedPublisher);

      const result = await controller.updatePublisher(1, mockPublisherDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Publisher updated');
    });

    it('should handle publisher not found', async () => {
      jest
        .spyOn(publisherService, 'update')
        .mockRejectedValue(new Error('Publisher not found'));

      await expect(controller.updatePublisher(999, {})).rejects.toThrow(
        'Publisher not found',
      );
    });
  });
});
