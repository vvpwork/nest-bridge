import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserInterface } from '../interfaces';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { user }: { user: IUserInterface } = request;

  return user;
});
