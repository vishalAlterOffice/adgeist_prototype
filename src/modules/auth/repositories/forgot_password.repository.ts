import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import ForgotPassword from '../entities/forgot_password.entity';

@Injectable()
class ForgotPasswordRepository extends CrudRepository<ForgotPassword> {
  constructor(
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepository: Repository<ForgotPassword>,
  ) {
    super(forgotPasswordRepository);
  }

  async deleteExpiredTokens(): Promise<void> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const deleted = await this.forgotPasswordRepository
      .createQueryBuilder()
      .delete()
      .where('expiry < :date', { date: oneDayAgo })
      .execute();

    console.log('deleted', deleted);
  }
}

export default ForgotPasswordRepository;
