import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import Advertiser from '../entities/advertiser.entity';

@Injectable()
class AdvertiserRepository extends CrudRepository<Advertiser> {
  constructor(
    @InjectRepository(Advertiser)
    private readonly advertiserRepository: Repository<Advertiser>,
  ) {
    super(advertiserRepository);
  }
}

export default AdvertiserRepository;
