import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from './auth.decorator';
import { AuthService } from './service/auth.service';
import User from '../user/entities/user.entity';
import { sendResponse } from 'src/shared/util/sendResponse';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  async signUp(@Body() signUpDto: SignUpDto) {
    const newUser = await this.authService.signUp(signUpDto);

    return sendResponse(true, 'User created', newUser);
  }

  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return sendResponse(true, 'token created', token);
  }
}
