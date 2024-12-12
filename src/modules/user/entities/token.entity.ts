import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import User from './user.entity';

@Entity('token')
class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;

  @Column()
  userId: number;
}

export default Token;
