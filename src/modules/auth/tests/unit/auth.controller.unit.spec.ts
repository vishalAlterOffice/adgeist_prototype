// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from '../../auth.controller';
// import { AuthService } from '../../service/auth.service';
// import { SignUpDto } from '../../dto/signup.dto';

// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             oAuth: jest.fn(),
//             registerUser: jest.fn(),
//             loginUser: jest.fn(),
//             sendOtp: jest.fn(),
//             verifyEmail: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   describe('register', () => {
//     it('should register a user and return a token', async () => {
//       const signUpDto: SignUpDto = {
//         username: 'test_user',
//         email: 'test@example.com',
//         password: 'password123',
//       };
//       const token = 'mockToken';
//       jest.spyOn(authService, 'signUpDto').mockResolvedValue(token);

//       const result = await authController.signUp(signUpDto);

//       expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
//       expect(result).toEqual({
//         user: {},
//       });
//     });
//   });

//   describe('login', () => {
//     it('should log in a user and return a token', async () => {
//       const registerDto: RegisterDto = {
//         email: 'test@example.com',
//         password: 'password123',
//       };
//       const token = 'mockToken';
//       jest.spyOn(authService, 'loginUser').mockResolvedValue(token);

//       const result = await authController.login(registerDto);

//       expect(authService.loginUser).toHaveBeenCalledWith(registerDto);
//       expect(result).toEqual({
//         success: true,
//         message: 'Login Successful',
//         data: { token },
//       });
//     });
//   });

//   describe('forgotPassword', () => {
//     it('should send a password reset email', async () => {
//       const forgotPasswordDto: ForgotPasswordBodyDTO = {
//         email: 'test@example.com',
//       };
//       jest
//         .spyOn(passwordResetService, 'forgotPassword')
//         .mockResolvedValue(undefined);

//       const result = await authController.forgotPassword(forgotPasswordDto);

//       expect(passwordResetService.forgotPassword).toHaveBeenCalledWith(
//         forgotPasswordDto.email,
//       );
//       expect(result).toEqual({
//         success: true,
//         message: 'Password Reset Sent to Email',
//       });
//     });
//   });

//   describe('resetPassword', () => {
//     it('should reset the user password and return a token', async () => {
//       const params: ResetPasswordParamDto = { resetToken: 'mockResetToken' };
//       const resetPasswordDto: ResetPasswordBodyDto = {
//         password: 'newPassword123',
//       };
//       const token = 'mockToken';
//       jest
//         .spyOn(passwordResetService, 'resetPassword')
//         .mockResolvedValue(token);

//       const result = await authController.resetPassword(
//         params,
//         resetPasswordDto,
//       );

//       expect(passwordResetService.resetPassword).toHaveBeenCalledWith(
//         params.resetToken,
//         resetPasswordDto.password,
//       );
//       expect(result).toEqual({
//         success: true,
//         message: 'Successfully reset Password',
//         data: { token },
//       });
//     });
//   });

//   describe('verifyEmail', () => {
//     it('should verify user email', async () => {
//       const emailVerificationDto: EmailVerificationDTO = {
//         email: 'test@example.com',
//         otp: 123456,
//       };
//       jest.spyOn(authService, 'verifyEmail').mockResolvedValue(undefined);

//       const result = await authController.verifyEmail(emailVerificationDto);

//       expect(authService.verifyEmail).toHaveBeenCalledWith(
//         emailVerificationDto.email,
//         emailVerificationDto.otp,
//       );
//       expect(result).toEqual({
//         success: true,
//         message: 'Successfully sent otp to email',
//       });
//     });
//   });
// });
