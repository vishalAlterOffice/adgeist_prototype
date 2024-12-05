// Publisher Entity
import { IsUrl } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Company from 'src/modules/company/entities/company.entity';

@Entity('publisher')
class Publisher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  curr_monthly_revenue: string;

  @Column()
  expected_revenue: string;

  @Column()
  own_ad_space: string;

  @Column()
  @IsUrl()
  website_url: string;

  @OneToOne(() => Company, (company) => company.publisher)
  company: Company;
}

export default Publisher;
