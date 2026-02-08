import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  email: string;
  sub: number;
  type: 'access' | 'refresh';
}

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

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * payload에 들어갈 정보
   * 1) email
   * 2) sub -> id
   * 3) type -> accessToken 또는 refreshToken
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload: JwtPayload = {
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

  async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(registerUserDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });

    return this.loginUser(newUser);
  }

  /**
   * 토큰 사용 방식
   *
   * 1. 사용자가 로그인, 회원가입을 진행하면 accessToken과 refreshToken을 반환한다.
   *
   * 2. 로그인 할때는 Basic 토큰과 함께 요청을 보낸다.
   *   - Basic 토큰은 email과 password를 base64로 인코딩한 값이다.
   *   - 예) {authorization: 'Basic <base64(email:password)>'}
   *
   * 3. 아무나 접근 할 수 없는 정보 (private route)를 접근 할때는 accessToken을 Header에 담아서 요청을 보낸다.
   *   - 예) {authorization: 'Bearer <accessToken>'}
   *
   * 4. 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 요청을 보낸 사용자가 누구인지 알 수 있다.
   *   - 예) 현재 로그인 중인 사용자의 포스트만 가져오려면 토큰의 sub 값에 입력돼있는 id를 사용하여 포스트를 조회한다.
   *
   * 5. 모든 토큰은 만료 기간이 있다. 만료 기간이 지나면 새로 토큰을 발급받아야한다.
   *   - 그렇지 않으면 jwtService.verify() 에서 인증 실패한다.
   *   - accessToken을 새로 발급 받을 수 있는 /auth/token/access와 refreshToken을 새로 발급 받을 수 있는 /auth/token/refresh 엔드포인트가 필요하다.
   *
   * 6. 새로운 토큰을 발급 받으면 새로운 토큰을 사용해서 다시 요청을 보내야한다.
   */

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitHeader = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitHeader.length !== 2 || splitHeader[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰 형식입니다.');
    }

    return splitHeader[1];
  }

  decodeBasicToken(base64Token: string) {
    const decoded = Buffer.from(base64Token, 'base64').toString('utf-8');

    const [email, password] = decoded.split(':');

    if (!email || !password) {
      throw new UnauthorizedException('잘못된 토큰 형식입니다.');
    }

    return { email, password };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: JWT_SECRET,
      });
    } catch (e) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('refreshToken으로만 토큰 갱신이 가능합니다.');
    }

    return this.signToken({ email: decoded.email, id: decoded.sub }, isRefreshToken);
  }
}
