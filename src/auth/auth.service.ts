import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
  /**
   * 만들려는 기능
   *
   * 1. registerWithEmail
   *    - email, nickname, password를 입력받고 사용자를 생성한다.
   *    - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
   *    - 회원가입 후 바로 로그인상태 유지
   *
   * 2. loginWithEmail
   *    - email, password를 입력하면 사용자 검증을 진행한다.
   *    - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
   *
   * 3. loginUser
   *    - (1)과 (2)에서 필요한 accessToken과 refreshToken을 반환하는 로직
   *
   * 4. signToken
   *    - (3)에서 필요한 accessToken과 refreshToken을 생성하는 로직
   *
   * 5. authenticateWithEmailAndPassword
   *    - (2)에서 로그인을 진행할 때 사용자 검증을 진행하는 로직
   *      1) 사용자가 존재하는지 확인
   *      2) 비밀번호가 일치하는지 확인
   *      3) 검증이 완료되면 찾은 사용자 정보 반환
   */

  constructor(private readonly jwtService: JwtService) {}

  /**
   * payload에 들어갈 정보
   * 1) email
   * 2) sub -> id
   * 3) type -> accessToken 또는 refreshToken
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);
    return { accessToken, refreshToken };
  }
}
