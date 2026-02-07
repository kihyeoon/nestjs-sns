import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MinLengthPipe, MaxLengthPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  rotateAccessToken(@Headers('authorization') header: string) {
    const token = this.authService.extractTokenFromHeader(header, true);

    const newAccessToken = this.authService.rotateToken(token, false);

    return { accessToken: newAccessToken };
  }

  @Post('token/refresh')
  rotateRefreshToken(@Headers('authorization') header: string) {
    const token = this.authService.extractTokenFromHeader(header, true);

    const newRefreshToken = this.authService.rotateToken(token, true);

    return { refreshToken: newRefreshToken };
  }

  @Post('login/email')
  async loginWithEmail(@Headers('authorization') header: string) {
    const token = this.authService.extractTokenFromHeader(header, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  async registerWithEmail(
    @Body('email') email: string,
    @Body('password', new MinLengthPipe(3), new MaxLengthPipe(8)) password: string,
    @Body('nickname') nickname: string,
  ) {
    return this.authService.registerWithEmail({ email, password, nickname });
  }
}
