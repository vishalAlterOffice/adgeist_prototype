import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './services/users.service';
import { sendResponse } from 'src/shared/util/sendResponse';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Request() req: any) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = req.user;
    return sendResponse(true, 'Current user', userWithoutPassword);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const users = await this.usersService.getAllUsers(page, limit);
    const allUsers = users?.map(({ password, ...user }) => user);
    return sendResponse(true, 'All users fetched', allUsers);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(Number(id));
    if (!user) {
      return sendResponse(true, 'User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return sendResponse(true, 'User fetched successfully', userWithoutPassword);
  }
}
