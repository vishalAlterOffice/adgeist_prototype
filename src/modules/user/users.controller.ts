import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import User from './entities/user.entity';
import { UsersService } from './services/users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Roles('ADMIN', 'USER')
  async getCurrentUser(@Request() req: any): Promise<Partial<User>> {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }

  @Get()
  @Roles('ADMIN')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users.map(({ password, ...user }) => user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Partial<User>> {
    const user = await this.usersService.getUserById(Number(id));
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
