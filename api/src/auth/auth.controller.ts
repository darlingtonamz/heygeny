import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DTOValidationPipe } from '../common/pipes/dtovalidation.pipe';
import { LoginDTO, RegisterDTO } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    // @Body() body: { email: string; password: string }
    @Body(new DTOValidationPipe(LoginDTO)) body: LoginDTO,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    // @Body() body: { email: string; password: string }
    @Body(new DTOValidationPipe(RegisterDTO)) body: RegisterDTO,
) {
    return this.authService.register(body);
  }
}