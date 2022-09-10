import { ExecutionContext, Module } from '@nestjs/common';
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
import { BlockchainModule } from '../blockchain';
import { SecuritizeModule } from '../securitize';

const { ttl, secret } = config.jwt;

@Module({
  imports: [
    JwtModule.register({
      secret,
      signOptions: { expiresIn: ttl },
    }),
    ProfileModule,
    IdentityModule,
    BlockchainModule,
    SecuritizeModule,
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
    if (isPublic) {
      return true;
    }

    const request = this.getRequest(context);

    return this.auth.isAuthenticated(request);
  }

  public getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
}
