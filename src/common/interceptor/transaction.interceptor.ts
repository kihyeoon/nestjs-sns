import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { DataSource, QueryRunner } from 'typeorm';

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
      catchError((error: Error) =>
        from(qr.rollbackTransaction()).pipe(
          switchMap(() => from(qr.release())),
          switchMap(() =>
            throwError(() =>
              error instanceof HttpException
                ? error
                : new InternalServerErrorException(error.message),
            ),
          ),
        ),
      ),
      switchMap((result: unknown) =>
        from(qr.commitTransaction()).pipe(
          switchMap(() => from(qr.release())),
          map(() => result),
        ),
      ),
    );
  }
}
