import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserCompanyRole from './user_companyRole.entity';

@Entity('user')
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserCompanyRole, (userCompanyRole) => userCompanyRole.user)
  companyRoles: UserCompanyRole[];
}

export default User;
