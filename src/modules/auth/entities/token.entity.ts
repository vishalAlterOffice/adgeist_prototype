import User from 'src/modules/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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
