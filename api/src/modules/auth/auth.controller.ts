/* eslint-disable import/no-extraneous-dependencies */
import { Body, Controller, ForbiddenException, Logger, Next, Post, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { NextFunction, Response } from 'express';
import { Public, User } from '@/common/decorators';
import { ILoginResponse, LoginDto } from './dtos/auth-login.dto';
import { AuthService } from './auth.service';
import { IdentityService } from '../identity/identity.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService, private identityService: IdentityService) {}

  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiResponse({
    status: 200,
    description: 'User was authorized',
    type: ILoginResponse,
  })
  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto, @Res() res: Response) {
    const { address, code, chainId } = body;
    const { id, whiteListTransaction } = await this.authService.login(address, code, chainId);
    return res.status(200).send(
      whiteListTransaction
        ? {
            token: this.authService.jwtSign(id),
            whiteListTransaction,
          }
        : { token: this.authService.jwtSign(id) },
    );
  }

  @Public()
  @Post('register')
  public async register(@Body() body: LoginDto) {
    return 'register';
  }

  @Post('logout')
  public async logout(@User() user: any, @Res() res: Response) {
    const { tokenData } = user;
    Logger.log('user', user);

    await this.authService.jwtBlock(tokenData.token, tokenData.exp);
    // TODO add logic logout from securitize

    return res.status(200).send({ data: 'Token was added to BlackList' });
  }
}
