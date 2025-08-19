import {createParamDecorator, type ExecutionContext} from '@nestjs/common';
import { UserEntity } from '../users/user.entity';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserEntity;
});