import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PublisherRepository from '../repositories/publisher.repository';
import { PublisherDto } from '../dto/publisher.dto';
import User from 'src/modules/user/entities/user.entity';
import CompanyRepository from 'src/modules/company/repositories/company.repository';
import Publisher from '../entities/publisher.entity';

@Injectable()
export class PublisherService {
  constructor(
    private readonly publisherRepository: PublisherRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  // Create a new company
  async create(
    companyId: number,
    publisherDto: PublisherDto,
    user: User,
  ): Promise<{ publisher: any }> {
    // Check if the company exists
    const company = await this.companyRepository.findOne({ id: companyId });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

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
      type: Array.isArray(publisherDto.type)
        ? publisherDto.type
        : [publisherDto.type], // Ensure type is an array
      company,
    });

    console.log('publisher', publisher);

    return { publisher: publisher };
  }

  // Update a company (only allowed for ADMIN users of the company)
  async update(
    companyId: number,
    publisherDto: Partial<PublisherDto>,
  ): Promise<{ publisher: Partial<Publisher> }> {
    const company = await this.companyRepository.findOne({
      id: companyId,
    });

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
  async delete(publisherId: number): Promise<{ message: string }> {
    // Delete the company
    await this.publisherRepository.destroy(publisherId);

    return { message: 'Publisher deleted successfully' };
  }

  // Get publisher by ID
  async getPublisherById(companyId: number): Promise<{ publisher: Publisher }> {
    const company = await this.companyRepository.findOne({
      id: companyId,
    });

    return { publisher: company.publisher };
  }
}
