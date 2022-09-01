import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import type { IPayload } from './auth.interface';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  public serializeUser(user: IPayload, done: (err: Error | null, data?: IPayload) => void): void {
    done(null, user);
  }

  public deserializeUser(data: IPayload, done: (err: Error | null, user?: IPayload) => void): void {
    try {
      // const user = await fetchMore();
      done(null, data);
    } catch (err) {
      done(<Error>err);
    }
  }
}
