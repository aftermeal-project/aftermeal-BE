import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../../modules/auth/domain/types/jwt-payload';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenPayload: AccessTokenPayload = request.user;

    return data ? tokenPayload?.[data] : tokenPayload;
  },
);
