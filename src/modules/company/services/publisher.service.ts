import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PublisherRepository from '../repositories/publisher.repository';
import { PublisherDto } from '../dto/publisher.dto';
import CompanyRepository from 'src/modules/company/repositories/company.repository';
import Publisher from '../entities/publisher.entity';
import { ensureArray } from 'src/shared/util/helper';
import { AdvertiserService } from './advertiser.service';

@Injectable()
export class PublisherService {
  constructor(
    private readonly publisherRepository: PublisherRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly advertiserService: AdvertiserService,
  ) {}

  // Create a new company
  async createPublisher(
    companyId: number,
    publisherDto: PublisherDto,
  ): Promise<{ publisher: any }> {
    // Check if the company exists
    const company = await this.advertiserService.findCompanyById(companyId);

    // Check if the company already has an advertiser
    const existingAdvertiser = await this.publisherRepository.findOne({
      company: { id: companyId },
    });

    if (existingAdvertiser) {
      throw new ForbiddenException(
        `Publisher for company with ID ${companyId} already exists`,
      );
    }

    // Create and save the new publisher
    const publisher = await this.publisherRepository.create({
      ...publisherDto,
      type: ensureArray(publisherDto.type), // Ensure type is an array
      company,
    });

    return { publisher };
  }

  // Update a company (only allowed for ADMIN users of the company)
  async updatePublisher(
    companyId: number,
    publisherDto: Partial<PublisherDto>,
  ): Promise<{ publisher: Partial<Publisher> }> {
    const company = await this.advertiserService.findCompanyById(companyId, [
      'publisher',
    ]);

    if (!company) {
      throw new NotFoundException(
        `Advertiser with ${companyId} ID is not found`,
      );
    }

    // update Publisher
    const updatedPublisher = await this.publisherRepository.update(
      company.publisher.id,
      {
        ...publisherDto,
      },
    );

    if (!updatedPublisher)
      throw new NotFoundException('Failed to update Advertiser');

    return { publisher: updatedPublisher };
  }

  // Delete publisher
  async deletePublisher(publisherId: number): Promise<{ message: string }> {
    // Delete the company
    await this.publisherRepository.destroy(publisherId);

    return { message: 'Publisher deleted successfully' };
  }

  // Get publisher by ID
  async getPublisherByCompanyId(
    companyId: number,
  ): Promise<{ publisher: Publisher }> {
    const company = await this.advertiserService.findCompanyById(companyId, [
      'publisher',
    ]);

    return { publisher: company.publisher };
  }
}
