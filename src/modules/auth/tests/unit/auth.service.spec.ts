import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/modules/user/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../service/auth.service';
import { SignUpDto } from '../../dto/signup.dto';
import { LoginDto } from '../../dto/login.dto';

jest.mock('src/modules/user/services/users.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should register a user with hashed password', async () => {
      const mockSignUpDto: SignUpDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };

      const hashedPassword = await bcrypt.hash(mockSignUpDto.password, 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockUser);

      const result = await authService.signUp(mockSignUpDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        mockSignUpDto.email,
      );
      expect(usersService.createUser).toHaveBeenCalledWith({
        user_name: mockSignUpDto.username,
        email: mockSignUpDto.email,
        password: hashedPassword,
      });
      expect(result).toEqual({
        user: { id: 1, email: 'test@example.com', username: 'testuser' },
      });
    });
  });

  describe('login', () => {
    it('should authenticate a user and return a JWT token', async () => {
      const mockLoginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };
      const mockToken = 'mock-jwt-token';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(mockLoginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
      expect(result).toEqual({ token: mockToken });
    });
  });
});
