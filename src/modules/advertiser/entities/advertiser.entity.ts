import { IsUrl } from 'class-validator';
import Company from 'src/modules/company/entities/company.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Advertiser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marketingHandledBy: string;

  @Column()
  annualRevenue: string;

  @Column()
  marketingBudget: string;

  @Column()
  @IsUrl()
  website_url: string;

  @OneToOne(() => Company, (company) => company.advertiser)
  company: Company[];
}

export default Advertiser;
