import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import Token from '../entities/token.entity';

@Injectable()
class TokenRepository extends CrudRepository<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }

  async deleteRefreshToken(refreshToken: string) {
    await this.tokenRepository.delete({ refreshToken: refreshToken });
  }
}

export default TokenRepository;
