import { Test, TestingModule } from '@nestjs/testing';
import { sendResponse } from 'src/shared/util/sendResponse';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../service/auth.service';
import {
  mockLoginDto,
  mockSignUpDto,
  mockToken,
  mockUsers,
} from 'src/shared/tests/testData';
import { RefreshToken } from '../../dto/refreshToken.dto';
import { IdTokenDto } from '../../dto/ID_Token.dto';

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
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await authController.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(sendResponse(true, 'Token created', mockToken));
    });
  });

  describe('refresh', () => {
    it('should create a new refresh token', async () => {
      const refreshToken: RefreshToken = {
        refreshToken: 'refresh_token_jwt',
      };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(mockToken);

      const req = {
        user: mockUsers[0],
      };

      const result = await authController.refreshToken(refreshToken, req);

      expect(result).toEqual(sendResponse(true, 'Tokens refreshed', mockToken));
    });
  });

  describe('google/token-auth', () => {
    it('should log in a user and return a access and refresh token', async () => {
      const mockIDToken: IdTokenDto = {
        idToken: 'mock-access-token',
      };

      jest.spyOn(authService, 'googleIdTokenAuth').mockResolvedValue(mockToken);

      const result = await authController.googleIdTokenAuth(mockIDToken);
      expect(result).toEqual(
        sendResponse(true, 'Authenticated Successfully', mockToken),
      );
    });
  });
});
