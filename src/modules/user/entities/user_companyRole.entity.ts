import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import User from './user.entity';
import Company from 'src/modules/company/entities/company.entity';
import Role from 'src/shared/entities/roles.entity';

@Entity('user_company_role')
class UserCompanyRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.companyRoles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Company, (company) => company.userCompanyRoles)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_company_role_roles',
    joinColumn: { name: 'user_company_role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}

export default UserCompanyRole;
