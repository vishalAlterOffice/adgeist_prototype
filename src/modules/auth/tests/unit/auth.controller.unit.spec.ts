import { Test, TestingModule } from '@nestjs/testing';
import { sendResponse } from 'src/shared/util/sendResponse';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../service/auth.service';
import { mockLoginDto, mockSignUpDto } from 'src/shared/tests/testData';

jest.mock('../../service/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should register a new user and return a response', async () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', username: 'testuser' },
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(mockResponse);

      const result = await authController.signUp(mockSignUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(mockSignUpDto);
      expect(result).toEqual(sendResponse(true, 'User created', mockResponse));
    });
  });

  describe('login', () => {
    it('should log in a user and return a JWT token', async () => {
      const mockToken = { token: 'mock-jwt-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await authController.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(sendResponse(true, 'Token created', mockToken));
    });
  });
});
