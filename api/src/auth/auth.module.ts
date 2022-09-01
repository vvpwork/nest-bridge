import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@Common/config';

import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { JwtStrategy, JwtVerifyStrategy, LocalStrategy } from './strategies';

const { secret, ttl } = config.jwt;
@Module({
  imports: [
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: ttl },
    }),
  ],

  providers: [AuthService, AuthSerializer, LocalStrategy, JwtStrategy, JwtVerifyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
