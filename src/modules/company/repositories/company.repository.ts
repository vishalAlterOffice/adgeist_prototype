import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import Company from '../entities/company.entity';

@Injectable()
class CompanyRepository extends CrudRepository<Company> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {
    super(companyRepository);
  }
}

export default CompanyRepository;
