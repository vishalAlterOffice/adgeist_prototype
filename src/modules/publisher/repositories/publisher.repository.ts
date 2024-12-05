import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import Publisher from '../entities/publisher.entity';

@Injectable()
class PublisherRepository extends CrudRepository<Publisher> {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {
    super(publisherRepository);
  }
}

export default PublisherRepository;
