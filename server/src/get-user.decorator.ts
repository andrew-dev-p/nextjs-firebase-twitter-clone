import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from './types/entities';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserEntity }>();
    return request.user;
  },
);
