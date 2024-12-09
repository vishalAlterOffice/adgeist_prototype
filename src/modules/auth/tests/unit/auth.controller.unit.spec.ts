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
            signUp: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard({})
      .useValue({})
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and return a token', async () => {
      const registerDto: SignUpDto = {
        username: 'user',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authController.signUp(registerDto);

      expect(authService.signUp).toHaveBeenCalledWith(registerDto);
      expect(result.success).toEqual(true);
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
      expect(result.success).toEqual(true);
    });
  });
});
