import { Injectable, NotFoundException } from '@nestjs/common';
import UserRepository from 'src/modules/user/repositories/user.repository';

@Injectable()
export class PublisherService {
  constructor(private readonly userRepository: UserRepository) {}
}