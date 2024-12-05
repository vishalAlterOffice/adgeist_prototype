import UserCompanyRole from 'src/modules/user/entities/user_companyRole.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('role')
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  role_name: string; // e.g., 'ADMIN', 'MEMBER'

  @OneToMany(() => UserCompanyRole, (userCompanyRole) => userCompanyRole.role)
  userCompanyRoles: UserCompanyRole[];
}

export default Role;
