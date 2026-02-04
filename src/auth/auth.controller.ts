import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  async loginWithEmail(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.loginWithEmail({ email, password });
  }

  @Post('register/email')
  async registerWithEmail(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
  ) {
    return this.authService.registerWithEmail({ email, password, nickname });
  }
}
