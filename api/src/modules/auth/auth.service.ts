import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';

import { config } from '@Common/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { where } from 'sequelize/types';
import { IdentityService } from '../identity/identity.service';
import { BlockchainIdentityAddressModel, BlockchainModel, IdentityModel, ProfileModel } from '@/db/models';
import { BlockchainService } from '../blockchain/blockchain.service';
import { SecuritizeService } from '../securitize';
import { IUserInterface } from '@/common/interfaces';
import { ACCOUNT_TYPES, PROFILE_STATUS } from '@/db/enums';

const { secret, ttl } = config.jwt;

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRedis() private readonly redis: Redis,
    @InjectModel(BlockchainIdentityAddressModel) private bcIdentityAddressModel: typeof BlockchainIdentityAddressModel,
    @InjectModel(IdentityModel) private identityModel: typeof IdentityModel,
    @InjectModel(BlockchainModel) private bcModel: typeof BlockchainModel,
    @InjectModel(ProfileModel) private profileModel: typeof ProfileModel,
    private identityService: IdentityService,
    private bcService: BlockchainService,
    private securitizeService: SecuritizeService,
  ) {}

  public async login(address: string, code: string, chainId: number) {
    if (!this.bcService.isEthAddress(address)) throw new HttpException('Invalid blockchain address', 403);
    if (
      !(await this.bcModel.findOne({
        where: {
          chainId,
        },
      }))
    )
      throw new HttpException(`Chain with id ${chainId} was not found `, 404);

    const { investorId, statusKyc, isPartner, whiteListTransaction } =
      config.nodeEnv === 'development'
        ? { investorId: 'develop', statusKyc: PROFILE_STATUS.VERIFIED, isPartner: false, whiteListTransaction: null }
        : await this.securitizeService.login(code, address);

    const userDataFromDB = await this.bcIdentityAddressModel.findOne({
      where: {
        address,
      },
    });

    if (userDataFromDB) {
      await this.identityModel.update(
        {
          status: statusKyc,
        },
        {
          where: {
            id: userDataFromDB.toJSON().identityId,
          },
        },
      );

      return { id: userDataFromDB.toJSON().identityId };
    }

    let identity = await this.identityModel.findOne({
      where: {
        securitizeId: investorId,
      },
    });

    if (!identity) {
      const profile = await this.profileModel.create({ userName: 'new user' });

      identity = await this.identityModel.create({
        securitizeId: investorId,
        profileId: profile.id,
        status: statusKyc,
        accountType: isPartner ? ACCOUNT_TYPES.PARTNER : ACCOUNT_TYPES.USER,
      });
    }

    identity.status = statusKyc;
    await identity.save();

    await this.bcIdentityAddressModel.findOrCreate({
      where: {
        chainId,
        address,
        identityId: identity.id,
      },
    });

    return whiteListTransaction
      ? {
          id: identity.id,
          whiteListTransaction,
        }
      : {
          id: identity.id,
        };
  }

  private makeRedisKey(token: string) {
    return `black:${token}`;
  }

  public async jwtBlock(token: string, expire: string | number) {
    await this.redis.set(this.makeRedisKey(token), token, 'EX', expire);
  }

  public async jwtValidate(token: string): Promise<null | { sub: string }> {
    try {
      if (!this.jwt.verify(token, { secret })) return null;

      // check blacklist
      const jwtFromBlackList = await this.redis.get(this.makeRedisKey(token));
      if (jwtFromBlackList) return null;

      return <{ sub: string }>this.jwt.decode(token);
    } catch (err) {
      return null;
    }
  }

  public jwtSign(userId: string | number): string {
    const IPayload = { sub: userId };
    return this.jwt.sign(IPayload, { expiresIn: ttl });
  }

  // TODO add request interface
  public async isAuthenticated(req: Request | any) {
    if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.includes('Bearer')))
      return false;

    const reqToken = req.headers.authorization.split(' ')[1];

    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData || !tokenData.sub) return false;

    const userFromDB = await this.identityService.findByKey({ id: tokenData.sub });

    if (userFromDB) {
      req.user = {
        data: userFromDB.toJSON(),
        tokenData: {
          token: reqToken,
          ...tokenData,
        },
      } as IUserInterface;

      return true;
    }

    return false;
  }

  async getUserFromReqHeaders(req: Request | any) {
    if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.includes('Bearer')))
      return null;

    const reqToken = req.headers.authorization.split(' ')[1];
    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData) return null;

    const identity = await this.identityService.findByKey({ id: tokenData.sub });
    req.user = { data: identity };
    return true;
  }
}
