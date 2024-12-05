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

  //   // Custom method to find a user by username
  //   async findByEmail(email: string): Promise<User | null> {
  //     return this.userRepository.findOne({ where: { email: email } });
  //   }

  //   // Custom method to create a user
  //   async createUser(data: Partial<User>): Promise<User> {
  //     const user = this.userRepository.create(data);
  //     return this.userRepository.save(user);
  //   }
}

export default CompanyRepository;
