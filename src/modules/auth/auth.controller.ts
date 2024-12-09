import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from './auth.decorator';
import { AuthService } from './service/auth.service';
import { sendResponse } from 'src/shared/util/sendResponse';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import User from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Validation errors or bad request' })
  @ApiBody({ type: SignUpDto }) // Fixed the usage of @ApiBody
  @Public()
  async signUp(@Body() signUpDto: SignUpDto) {
    const newUser = await this.authService.signUp(signUpDto);

    return sendResponse(true, 'User created', newUser);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns a JWT token',
    schema: {
      example: {
        success: true,
        message: 'Token created',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return sendResponse(true, 'Token created', token);
  }
}
