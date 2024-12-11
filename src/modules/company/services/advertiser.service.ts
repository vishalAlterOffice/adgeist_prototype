import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import AdvertiserRepository from '../repositories/advertiser.repository';
import CompanyRepository from '../repositories/company.repository';
import Advertiser from '../entities/advertiser.entity';
import User from 'src/modules/user/entities/user.entity';
import { AdvertiserDto } from '../dto/advertiser.dto';
import { ensureArray } from 'src/shared/util/helper';

@Injectable()
export class AdvertiserService {
  constructor(
    private readonly advertiserRepository: AdvertiserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  // Create Advertiser
  async createAdvertiser(
    companyId: number,
    advertiserDto: AdvertiserDto,
    user: User,
  ): Promise<{ advertiser: Advertiser }> {
    const company = await this.findCompanyById(companyId);

    const existingAdvertiser = await this.advertiserRepository.findOne({
      company: { id: companyId },
    });

    if (existingAdvertiser) {
      throw new ForbiddenException(
        `Advertiser for company with ID ${companyId} already exists`,
      );
    }

    const advertiser = await this.advertiserRepository.create({
      ...advertiserDto,
      marketingHandledBy: ensureArray(advertiserDto.marketingHandledBy),
      company,
    });

    return { advertiser };
  }

  // Update Advertiser
  async updateAdvertiser(
    companyId: number,
    advertiserDto: Partial<AdvertiserDto>,
  ): Promise<{ advertiser: Partial<Advertiser> }> {
    const company = await this.findCompanyById(companyId, ['advertiser']);

    const updatedAdvertiser = await this.advertiserRepository.update(
      company.advertiser.id,
      advertiserDto,
    );

    if (!updatedAdvertiser) {
      throw new NotFoundException('Failed to update Advertiser');
    }

    return { advertiser: updatedAdvertiser };
  }

  // Delete Advertiser
  async deleteAdvertiser(advertiserId: number): Promise<{ message: string }> {
    await this.advertiserRepository.destroy(advertiserId);
    return { message: 'Advertiser deleted successfully' };
  }

  // Get Advertiser by ID
  async getAdvertiserByCompanyId(
    companyId: number,
  ): Promise<{ advertiser: Advertiser }> {
    const company = await this.findCompanyById(companyId, ['advertiser']);
    return { advertiser: company.advertiser };
  }

  // Helper: Find Company with Relations
  async findCompanyById(
    companyId: number,
    relations: string[] = [],
  ): Promise<any> {
    const company = await this.companyRepository.findOneByRelation(
      companyId,
      relations,
    );
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
    return company;
  }
}
