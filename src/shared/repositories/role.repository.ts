import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import Role from '../entities/roles.entity';

@Injectable()
class RoleRepository extends CrudRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async findByNames(roleNames: string[]): Promise<Role[]> {
    return this.roleRepository.find({ where: { role_name: In(roleNames) } });
  }
}

export default RoleRepository;
