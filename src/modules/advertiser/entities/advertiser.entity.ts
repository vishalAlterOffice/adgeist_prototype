// Advertiser Entity
import { IsUrl } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Company from 'src/modules/company/entities/company.entity';

@Entity('advertiser')
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
  company: Company;
}

export default Advertiser;
