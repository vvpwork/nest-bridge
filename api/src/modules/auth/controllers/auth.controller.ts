/* eslint-disable import/no-extraneous-dependencies */
import { Body, Controller, Header, Post, Req, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Public, User } from '@/common/decorators';
import { ILoginResponse, LoginDto } from '../dtos/auth-login.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiResponse({
    status: 200,
    description: 'User was authorized',
    type: ILoginResponse,
  })
  public async login(@Body() body: LoginDto, @Res() res: Response) {
    // TODO add general logic

    return res.status(200).send({
      token: this.authService.jwtSign(50),
    });
  }

  @Public()
  @Post('register')
  public async register(@Body() body: LoginDto) {
    return 'register';
  }

  @Post('logout')
  public async logout(@User() user: any, @Res() res: Response) {
    const { tokenData } = user;

    await this.authService.jwtBlock(tokenData.token, tokenData.exp);

    return res.status(200).send({ data: 'token added to BlackList' });
  }
}
