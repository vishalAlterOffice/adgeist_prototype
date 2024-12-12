import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserCompanyRole from './user_companyRole.entity';
import Token from './token.entity';

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

  @Column()
  googleId: string;

  @OneToMany(() => UserCompanyRole, (userCompanyRole) => userCompanyRole.user)
  companyRoles: UserCompanyRole[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token;
}

export default User;
