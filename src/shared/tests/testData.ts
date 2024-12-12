import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { AdvertiserDto } from 'src/modules/company/dto/advertiser.dto';
import { CompanyDto } from 'src/modules/company/dto/company.dto';
import { PublisherDto } from 'src/modules/company/dto/publisher.dto';
import Token from 'src/modules/user/entities/token.entity';
import User from 'src/modules/user/entities/user.entity';

export const mockSignUpDto: SignUpDto = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123!',
};

export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'Password123!',
};

export const mockUsers: Partial<User[]> = [
  {
    id: 1,
    email: 'test1@example.com',
    user_name: 'testuser1',
    password: 'kskdasds223',
    companyRoles: [],
    tokens: new Token(),
    googleId: '',
  },
  {
    id: 2,
    email: 'test2@example.com',
    user_name: 'testuser2',
    password: 'kskd28232',
    companyRoles: [],
    tokens: new Token(),
    googleId: '',
  },
];

export const mockCompanyDto: CompanyDto = {
  company_name: 'google',
  GST_No: 'BHCCDY9928880',
  address: 'xyz, abc',
  city: 'Bangalore',
  pin_code: 112233,
  industry: 'IT',
  country: 'India',
  contact_no: '1234567890',
};

export const mockAdvertiserDto: AdvertiserDto = {
  marketingHandledBy: ['agency'],
  annualRevenue: 20000,
  marketingBudget: 28000,
  website_url: 'www.google.com',
};

export const fakeAdvertiserDto: AdvertiserDto = {
  marketingHandledBy: ['dfsdfsd'], // Value other than ENUMs
  annualRevenue: 1212,
  marketingBudget: 28000,
  website_url: 'www.google.com',
};

export const mockPublisherDto: PublisherDto = {
  type: ['magazine'],
  curr_monthly_revenue: 39999,
  expected_revenue: 89,
  own_ad_space: '21',
  website_url: 'www.google.com',
};

export const mockCompany = {
  id: 1,
  company_name: 'google',
  GST_No: 'BHCCDY9928880',
  address: 'xyz, abc',
  city: 'Bangalore',
  pin_code: 112233,
  industry: 'IT',
  country: 'India',
  contact_no: '1234567890',
  advertiser: null,
  publisher: null,
  userCompanyRoles: [],
};

export const mockToken = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};
