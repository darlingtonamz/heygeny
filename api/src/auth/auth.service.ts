import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getOneUser({ where: { email } });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (user && isPasswordValid) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'changeme',
      }),
    };
  }

  async getUserByEmail(email: string) {
    return await this.usersService.getOneUser({ where: { email } });
  }

  async register(user: RegisterDTO) {
    return this.usersService.createUser({
      ...user,
      passwordHash: await bcrypt.hash(user.password, 10),
    });
  }
}