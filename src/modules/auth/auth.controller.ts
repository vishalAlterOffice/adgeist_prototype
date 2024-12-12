import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from './auth.decorator';
import { AuthService } from './service/auth.service';
import { sendResponse } from 'src/shared/util/sendResponse';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import User from '../user/entities/user.entity';
import { RefreshToken } from './dto/refreshToken.dto';
import { AuthGuard } from '@nestjs/passport';
import { IdTokenDto } from './dto/ID_Token.dto';

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

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiBody({ type: RefreshToken })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  async refreshToken(@Body() refreshTokenDto: RefreshToken, @Req() req: any) {
    const { refreshToken } = refreshTokenDto;
    const tokens = await this.authService.refreshToken(
      req.user.id,
      refreshToken,
    );
    return sendResponse(true, 'Tokens refreshed', tokens);
  }

  @Delete('/logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.id);
    return sendResponse(true, 'Logout successful', null);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuth() {
    // Redirects to Google authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuthRedirect(@Req() req, @Res() res) {
    const redirectUrl = await this.authService.handleGoogleCallback(req.user);
    return res.redirect(redirectUrl);
  }

  @Post('google/token-auth')
  @Public()
  async googleIdTokenAuth(@Body() idTokenDto: IdTokenDto) {
    const tokens = await this.authService.googleIdTokenAuth(idTokenDto.idToken);
    return sendResponse(true, 'Authenticated Successfully', tokens);
  }
}
