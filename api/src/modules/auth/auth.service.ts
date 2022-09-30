import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';

import {
  BlockchainIdentityAddressModel,
  BlockchainModel,
  IdentityModel,
  ProfileModel,
} from '@DB/models';
import { ACCOUNT_TYPES, PROFILE_STATUS } from '@DB/enums';
import { config } from '@Common/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { IdentityService } from '../identity/identity.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { SecuritizeService } from '../securitize';
import { IUserInterface } from '@/common/interfaces';

const { secret, ttl } = config.jwt;

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRedis() private readonly redis: Redis,
    @InjectModel(BlockchainIdentityAddressModel)
    private bcIdentityAddressModel: typeof BlockchainIdentityAddressModel,
    @InjectModel(IdentityModel) private identityModel: typeof IdentityModel,
    @InjectModel(BlockchainModel) private bcModel: typeof BlockchainModel,
    @InjectModel(ProfileModel) private profileModel: typeof ProfileModel,
    private identityService: IdentityService,
    private bcService: BlockchainService,
    private securitizeService: SecuritizeService,
  ) {}

  public async login(address: string, code: string, chainId: number) {
    if (!this.bcService.isEthAddress(address))
      throw new HttpException('Invalid blockchain address', 403);
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
        ? {
            investorId: 'develop',
            statusKyc: PROFILE_STATUS.VERIFIED,
            isPartner: false,
            whiteListTransaction: null,
          }
        : await this.securitizeService.login(code, address);

    const userDataFromDB = await this.bcIdentityAddressModel.findOne({
      where: {
        address,
      },
    });

    const userBySecuritize = await this.identityModel.findOne({
      where: {
        securitizeId: config.nodeEnv === 'development' ? '62b309e5db759500127a9cc1' : investorId,
      },
    });

    if ((userDataFromDB && !userBySecuritize) || (!userDataFromDB && userBySecuritize)) {
      throw new HttpException('Invalid address for securitize id', 403);
    }
    Logger.log(investorId, statusKyc, isPartner, 'AuthService data from securitize');

    if (userDataFromDB && userBySecuritize) {
      if (userBySecuritize.toJSON().id !== userDataFromDB.toJSON().identityId) {
        throw new HttpException('Invalid address for securitize id', 403);
      }

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
      const profile = await this.profileModel.create({ userName: `${Date.now()}` });

      Logger.log(profile.toJSON(), 'AuthService new profile');
      identity = await this.identityModel.create({
        securitizeId: investorId,
        profileId: profile.id,
        status: statusKyc,
        accountType: isPartner ? ACCOUNT_TYPES.PARTNER : ACCOUNT_TYPES.USER,
      });
      Logger.log(identity.toJSON(), 'AuthService new identity');
    }

    const newBcAddress = await this.bcIdentityAddressModel.create({
      chainId,
      address,
      identityId: identity.id,
    });

    Logger.log(newBcAddress.toJSON(), 'AuthService new bc address');

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

  public async isAuthenticated(req: Request | any) {
    if (
      !req.headers.authorization ||
      (req.headers.authorization && !req.headers.authorization.includes('Bearer'))
    )
      return false;

    const reqToken = req.headers.authorization.split(' ')[1];

    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData || !tokenData.sub) return false;

    const userFromDB = await this.identityService.findByKey({ id: tokenData.sub });

    if (userFromDB) {
      req.user = {
        data: userFromDB,
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
    req.user = { data: {} };
    if (
      !req.headers.authorization ||
      (req.headers.authorization && !req.headers.authorization.includes('Bearer'))
    )
      return null;

    const reqToken = req.headers.authorization.split(' ')[1];
    const tokenData = await this.jwtValidate(reqToken);
    if (!tokenData) return null;

    const identity = await this.identityService.findByKey({ id: tokenData.sub });
    req.user = { data: identity };
    return true;
  }
}
