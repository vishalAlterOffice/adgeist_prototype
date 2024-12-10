import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from 'src/modules/user/services/users.service';
import User from 'src/modules/user/entities/user.entity';
import Role from 'src/shared/entities/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ user: Partial<User> }> {
    const { email, username, password } = signUpDto;

    // Check if the username already exists
    if (await this.userService.findByEmail(email)) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await this.userService.createUser({
      user_name: username,
      email: email,
      password: hashedPassword,
      // roles: roleEntities,
    });

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.userService.findByEmail(email);

    // Validate credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token
    const token = this.jwtService.sign({ id: user.id });
    return { token };
  }
}
