import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

export const QR = createParamDecorator((_: unknown, ctx: ExecutionContext): QueryRunner => {
  const req = ctx.switchToHttp().getRequest<{ queryRunner: QueryRunner }>();

  if (!req.queryRunner) {
    throw new Error('QueryRunner not found. TransactionInterceptor를 적용했는지 확인하세요.');
  }

  return req.queryRunner;
});
