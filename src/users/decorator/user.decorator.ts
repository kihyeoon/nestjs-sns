import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { UsersModel } from '../entities/users.entity';
import { Request } from 'express';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: UsersModel }>();

  const user = request.user;

  if (!user) {
    throw new InternalServerErrorException('Request에 user 정보가 없습니다.');
  }

  return user;
});
