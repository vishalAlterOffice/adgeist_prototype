import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../service/auth.service';
import { SignUpDto } from '../../dto/signup.dto';
import { LoginDto } from '../../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({
              success: true,
              message: 'User created',
            }),
            login: jest.fn().mockResolvedValue({
              success: true,
              message: 'token created',
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should register a user and return a token', async () => {
      const registerDto: SignUpDto = {
        username: 'user',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authController.signUp(registerDto);

      expect(authService.signUp).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ success: true, message: 'User created' });
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ success: true, message: 'token created' });
    });
  });
});
