import { Test, TestingModule } from '@nestjs/testing';
import { sendResponse } from 'src/shared/util/sendResponse';
import { UsersController } from '../../users.controller';
import { UsersService } from '../../services/users.service';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from '../../../auth/service/auth.service';
import User from '../../entities/user.entity';

jest.mock('../../services/users.service');
jest.mock('../../../auth/service/auth.service');

describe('UserController', () => {
  let userController: UsersController;
  let userService: UsersService;
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController, AuthController],
      providers: [UsersService, AuthService],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should register a new user and return a response', async () => {
      const mockSignUpDto: SignUpDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };

      const mockResponse = {
        user: { id: 1, email: 'test@example.com', username: 'testuser' },
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(mockResponse);

      const result = await authController.signUp(mockSignUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(mockSignUpDto);
      expect(result).toEqual(sendResponse(true, 'User created', mockResponse));
    });
  });

  describe('GetAllUser', () => {
    it('should return all users as a response', async () => {
      const mockUsers: Partial<User[]> = [
        {
          id: 1,
          email: 'test1@example.com',
          user_name: 'testuser1',
          password: 'kskdasds223',
          companyRoles: [],
        },
        {
          id: 2,
          email: 'test2@example.com',
          user_name: 'testuser2',
          password: 'kskd28232',
          companyRoles: [],
        },
      ];

      // Mock the getAllUsers method from userService
      jest.spyOn(userService, 'getAllUsers').mockResolvedValue(mockUsers);

      const result = await userController.getAllUsers(1, 10);

      // Assert that getAllUsers was called with the correct arguments
      expect(userService.getAllUsers).toHaveBeenCalledWith(1, 10);
      expect(result.success).toBe(true);
      expect(result.message).toBe('All users fetched');
      //   expect(result.data).toEqual(mockUsers); // Ensure that the returned data matches the mock
    });
  });

  describe('getUserByID', () => {
    it('should return user by ID', async () => {
      const mockResponse: User = {
        id: 2,
        email: 'test2@example.com',
        user_name: 'testuser2',
        password: 'kskd28232',
        companyRoles: [],
      };

      // Mock the getUserById method from usersService
      //   jest.spyOn(userService, 'getUserById').mockResolvedValue(mockResponse);

      const result = await userController.getUserById(mockResponse.id);

      // Assert that getUserById was called with the correct argument
      expect(userService.getUserById).toHaveBeenCalledWith(mockResponse.id);
      expect(result.success).toBe(true);
    });

    it('should return empty response when user is not found', async () => {
      // Mock the getUserById method to return null or undefined
      jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

      const result = await userController.getUserById(999);

      // Assert that the result is an empty response when user is not found
      expect(result.success).toBe(true);
      expect(result.message).toBe('User not found');
    });
  });
});
