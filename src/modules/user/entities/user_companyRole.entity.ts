import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @ManyToOne(() => Role, (role) => role.userCompanyRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}

export default UserCompanyRole;
