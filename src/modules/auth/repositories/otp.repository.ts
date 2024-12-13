import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import OTP from '../entities/otp.entity';

@Injectable()
class OTPRepository extends CrudRepository<OTP> {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {
    super(otpRepository);
  }
}

export default OTPRepository;
