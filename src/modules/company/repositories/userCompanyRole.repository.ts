import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import UserCompanyRole from 'src/modules/user/entities/user_companyRole.entity';

@Injectable()
class UserCompanyRoleRepository extends CrudRepository<UserCompanyRole> {
  constructor(
    @InjectRepository(UserCompanyRole)
    private readonly userCompanyRoleRepository: Repository<UserCompanyRole>,
  ) {
    super(userCompanyRoleRepository);
  }
}

export default UserCompanyRoleRepository;
