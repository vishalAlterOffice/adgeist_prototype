// Advertiser Entity
import { IsUrl } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Company from 'src/modules/company/entities/company.entity';

@Entity('advertiser')
class Advertiser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  marketingHandledBy: string[];

  @Column()
  annualRevenue: number;

  @Column()
  marketingBudget: number;

  @Column()
  @IsUrl()
  website_url: string;

  @OneToOne(() => Company, (company) => company.advertiser, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_advertiser' })
  company: Company;
}

export default Advertiser;
