import { Injectable, NotFoundException } from '@nestjs/common';
import User from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.findAllByRelation('roles');
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(data: Partial<User>): Promise<User> {
    return this.userRepository.create(data);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteById(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.destroy(user.id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
}
