import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  rotateAccessToken(@Headers('authorization') header: string) {
    const token = this.authService.extractTokenFromHeader(header, true);

    const newAccessToken = this.authService.rotateToken(token, false);

    return { accessToken: newAccessToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  rotateRefreshToken(@Headers('authorization') header: string) {
    const token = this.authService.extractTokenFromHeader(header, true);

    const newRefreshToken = this.authService.rotateToken(token, true);

    return { refreshToken: newRefreshToken };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginWithEmail(@Headers('authorization') header: string) {
    const token = this.authService.extractTokenFromHeader(header, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  async registerWithEmail(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerUserDto);
  }
}
