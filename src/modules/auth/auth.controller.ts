import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from './auth.decorator';
import { AuthService } from './service/auth.service';
import User from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  signUp(@Body() signUpDto: SignUpDto): Promise<{ user: Partial<User> }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @Public()
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
