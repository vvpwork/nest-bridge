import { ExecutionContext, Module, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlockchainIdentityAddressModel, BlockchainModel, IdentityModel, ProfileModel } from '@DB/models';
import { AuthController } from './auth.controller';
import { config } from '@/common/config';
import { AuthService } from './auth.service';

import { ProfileModule } from '../profile';
import { IdentityModule } from '../identity';
import { SecuritizeModule } from '../securitize';
import { BlockchainService } from '../blockchain/blockchain.service';
import { BlockchainModule } from '../blockchain';

const { ttl, secret } = config.jwt;

@Module({
  imports: [
    JwtModule.register({
      secret,
      signOptions: { expiresIn: ttl },
    }),
    ProfileModule,
    IdentityModule,
    SecuritizeModule,
    BlockchainModule,
    SequelizeModule.forFeature([IdentityModel, BlockchainIdentityAddressModel, BlockchainModel, ProfileModel]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  constructor(private reflector: Reflector, private auth: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    const request = this.getRequest(context);
    if (isPublic) {
      await this.auth.getUserFromReqHeaders(request);
      return true;
    }

    return this.auth.isAuthenticated(request);
  }

  public getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
}
