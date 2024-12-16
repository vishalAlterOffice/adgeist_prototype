import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otp')
class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  otp: number;

  @Column()
  expiry: Date;

  @Column({ default: false })
  isVerified: boolean;
}

export default OTP;
