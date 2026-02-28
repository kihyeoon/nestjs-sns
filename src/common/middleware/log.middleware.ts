import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LogMiddleware.name);

  use(req: Request, _res: Response, next: NextFunction) {
    this.logger.log(
      `[REQ] ${req.method} ${req.originalUrl} ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
    );

    next();
  }
}
