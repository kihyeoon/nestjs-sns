import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

/**
 * 요청/응답 로깅 인터셉터
 *
 * 요청이 들어올 때 [REQ] 로그를, 응답이 나갈 때 [RES] 로그와 소요 시간을 기록한다.
 * NestJS Logger를 사용하여 로그 레벨 관리 및 출처 추적이 가능하다.
 */
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const path = req.originalUrl;
    const now = Date.now();
    const startTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    // [REQ] /posts 2026. 2. 23. 오후 3:00:00
    this.logger.log(`[REQ] ${path} ${startTime}`);

    // next.handle()을 호출하면 라우트의 로직이 전부 실행되고 응답이 반환된다.
    return next.handle().pipe(
      tap(() => {
        // [RES] /posts 2026. 2. 23. 오후 3:00:01 150ms
        const endTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        this.logger.log(`[RES] ${path} ${endTime} ${Date.now() - now}ms`);
      }),
    );
  }
}
