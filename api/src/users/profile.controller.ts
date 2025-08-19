import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';
import { UserEntity } from './user.entity';

@Controller('profile')
export class ProfileController {
  @UseGuards(AuthGuard)
  @Get()
  getProfile(@User() user: UserEntity) {
    const { passwordHash, ...profile } = user;
    return profile;
  }
}