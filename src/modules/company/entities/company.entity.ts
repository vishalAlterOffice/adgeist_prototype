import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import Advertiser from 'src/modules/advertiser/entities/advertiser.entity';
import Publisher from 'src/modules/publisher/entities/publisher.entity';
import UserCompanyRole from 'src/modules/user/entities/user_companyRole.entity';

@Entity('company')
class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column({ unique: true })
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
  contact_no: string;

  @OneToMany(
    () => UserCompanyRole,
    (userCompanyRole) => userCompanyRole.company,
  )
  userCompanyRoles: UserCompanyRole[];

  @OneToOne(() => Advertiser, (advertiser) => advertiser.company)
  advertiser: Advertiser;

  @OneToOne(() => Publisher, (publisher) => publisher.company)
  publisher: Publisher;
}

export default Company;
