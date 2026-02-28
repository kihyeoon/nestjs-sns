import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { finalize, Observable, tap } from 'rxjs';
import { DataSource, QueryRunner } from 'typeorm';
import { catchError } from 'rxjs';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<Request & { queryRunner: QueryRunner }>();
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (error: Error) => {
        await qr.rollbackTransaction();
        throw new InternalServerErrorException(error.message);
      }),
      tap(() => {
        void qr.commitTransaction();
      }),
      finalize(() => {
        void qr.release();
      }),
    );
  }
}
