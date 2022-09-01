import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { config } from '@Common/config';
import type { IJwtPayload, IJwtSign, IPayload } from './auth.interface';

const { secret, ttl } = config.jwt;

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  public validateRefreshToken(data: IPayload, refreshToken: string): boolean {
    if (!this.jwt.verify(refreshToken, { secret })) {
      return false;
    }

    const IPayload = <{ sub: string }>this.jwt.decode(refreshToken);
    return IPayload.sub === data.userId;
  }

  public IJwtSign(data: IPayload): IJwtSign {
    const IPayload: IJwtPayload = { sub: data.userId, username: data.username, roles: data.roles };

    return {
      access_token: this.jwt.sign(IPayload),
      refresh_token: this.getRefreshToken(IPayload.sub),
    };
  }

  private getRefreshToken(sub: string): string {
    return this.jwt.sign(
      { sub },
      {
        secret,
        expiresIn: ttl,
      },
    );
  }
}
