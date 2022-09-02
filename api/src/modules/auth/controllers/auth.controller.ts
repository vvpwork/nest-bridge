/* eslint-disable import/no-extraneous-dependencies */
import { Body, Controller, Header, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public, User } from '@/common/decorators';
import { LoginDto } from '../dtos/auth-login.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto, @Res() res: Response) {
    // TODO add logic
    return res.status(200).send({
      data: {
        token: this.authService.jwtSign(50),
      },
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
