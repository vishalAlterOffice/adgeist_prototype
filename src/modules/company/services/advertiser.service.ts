import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import AdvertiserRepository from '../repositories/advertiser.repository';
import { AdvertiserDto } from '../dto/advertiser.dto';
import Advertiser from '../entities/advertiser.entity';
import User from 'src/modules/user/entities/user.entity';
import CompanyRepository from 'src/modules/company/repositories/company.repository';

@Injectable()
export class AdvertiserService {
  constructor(
    private readonly advertiserRepository: AdvertiserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  // Create a new company
  async create(
    companyId: number,
    advertiserDto: AdvertiserDto,
    user: User,
  ): Promise<{ advertiser: any }> {
    // Check if the company exists
    const company = await this.companyRepository.findOne({ id: companyId });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    // Check if the company already has an advertiser
    const existingAdvertiser = await this.advertiserRepository.findOne({
      company: { id: companyId },
    });

    if (existingAdvertiser) {
      throw new ForbiddenException(
        `Advertiser for company with ID ${companyId} already exists`,
      );
    }

    // Create and save the new advertiser
    const advertiser = await this.advertiserRepository.create({
      ...advertiserDto,
      marketingHandledBy: Array.isArray(advertiserDto.marketingHandledBy)
        ? advertiserDto.marketingHandledBy
        : [advertiserDto.marketingHandledBy], // Ensure type is an array
      company,
    });

    return { advertiser: advertiser };
  }

  // Update a company (only allowed for ADMIN users of the company)
  async update(
    advertiserId: number,
    advertiserDto: Partial<AdvertiserDto>,
  ): Promise<{ advertiser: Partial<Advertiser> }> {
    const advertiser = await this.advertiserRepository.findOne({
      id: advertiserId,
    });

    if (!advertiser) {
      throw new NotFoundException(
        `Advertiser with ${advertiserId} ID is not found`,
      );
    }

    // update Advertiser
    const updatedAdvertiser = await this.advertiserRepository.update(
      advertiserId,
      {
        ...advertiserDto,
      },
    );

    if (!updatedAdvertiser)
      throw new NotFoundException('Failed to update Advertiser');

    return { advertiser: updatedAdvertiser };
  }

  // Delete a company (only allowed for ADMIN users of the company)
  async delete(advertiserId: number, user: User): Promise<{ message: string }> {
    // Delete the company
    await this.advertiserRepository.destroy(advertiserId);

    return { message: 'Advertiser deleted successfully' };
  }

  // Get advertiser by ID
  async getAdvertiserById(
    advertiserId: number,
  ): Promise<{ advertiser: Advertiser }> {
    const advertiser = await this.advertiserRepository.findOne({
      id: advertiserId,
    });

    return { advertiser: advertiser };
  }
}
