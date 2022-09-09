import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';

import { config } from '@Common/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { IdentityService } from '../identity/identity.service';
import { IdentityModel } from '@/db/models';

const { secret, ttl } = config.jwt;

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRedis() private readonly redis: Redis,

    @InjectModel(IdentityModel) private identity: typeof IdentityModel,

    private identityService: IdentityService,
  ) {}

  public async login(address: string, chainId: number): Promise<{ id: number }> {
    try {
      const rowQuery = `
      SELECT d.id FROM  BlockchainIdentityAddress b
        JOIN Identity d ON d.id = b.identityId
      WHERE b.address = "${address}" && b.chainId = ${chainId}
      `;
      const [[result]] = await this.identity.sequelize.query(rowQuery);
      return result as any;
    } catch (err) {
      Logger.error(err);
    }
  }

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

  public async isAuthenticated(req: Request | any) {
    if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.includes('Bearer')))
      return false;

    const reqToken = req.headers.authorization.split(' ')[1];
    Logger.log(reqToken);
    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData) return false;

    const userFromDB = await this.identityService.findByKey({ id: tokenData.sub });
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

  async getUserFromReqHeaders(req: Request) {
    if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.includes('Bearer')))
      return null;

    const reqToken = req.headers.authorization.split(' ')[1];
    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData) return null;

    return this.identityService.findByKey({ id: tokenData.sub });
  }
}
