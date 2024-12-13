import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('forgot_password')
class ForgotPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  token: string;

  @Column()
  expiry: Date;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_At: Date;
}

export default ForgotPassword;
