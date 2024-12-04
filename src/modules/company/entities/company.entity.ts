import { MinLength } from 'class-validator';
import Advertiser from 'src/modules/advertiser/entities/advertiser.entity';
import Publisher from 'src/modules/publisher/entities/publisher.entity';
import User from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  company_name: string;

  @Column()
  GST_No: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  pin_code: number;

  @Column()
  industry: string;

  @Column()
  country: string;

  @Column()
  @MinLength(10)
  contact_no: string;

  @ManyToMany(() => User, (user) => user.company)
  user: User[];

  @OneToOne(() => Advertiser, (advertiser) => advertiser.company)
  advertiser: Advertiser[];

  @OneToOne(() => Publisher, (publisher) => publisher.company)
  publisher: Publisher[];
}

export default Company;
