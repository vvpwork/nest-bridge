import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { config } from '@Common/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/sequelize';
import { Identity } from '@DB/models';
import { ProfileService } from '@/modules/profile';

const { secret, ttl } = config.jwt;

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRedis() private readonly redis: Redis,
    @InjectModel(Identity)
    private identityModel: typeof Identity,
  ) {}

  private makeRedisKey(token: string) {
    return `black:${token}`;
  }

  public async jwtBlock(token: string, expire: string | number) {
    await this.redis.set(this.makeRedisKey(token), token, 'EX', expire);
  }

  public async jwtValidate(token: string): Promise<null | { sub: number }> {
    try {
      if (!this.jwt.verify(token, { secret })) return null;

      // check blacklist
      const jwtFromBlackList = await this.redis.get(this.makeRedisKey(token));
      if (jwtFromBlackList) return null;

      const decodedToken = <{ sub: number }>this.jwt.decode(token);
      return decodedToken;
    } catch (err) {
      return null;
    }
  }

  public jwtSign(userId: string | number): string {
    const IPayload = { sub: userId };
    return this.jwt.sign(IPayload, { expiresIn: ttl });
  }

  public async isAuthenticated(req: Request) {
    if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.includes('Bearer'))) return false;

    const reqToken = req.headers.authorization.split(' ')[1];
    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData) return false;

    const userFromDB = await this.identityModel.findByPk(tokenData.sub);
    if (userFromDB) {
      req.user = {
        data: userFromDB.toJSON(),
        tokenData: {
          token: reqToken,
          ...tokenData,
        },
      };
      return true;
    }

    return false;
  }
}
