import { Response } from 'express';
import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { User } from '@/common/decorators';
import { IUserInterface } from '@/common/interfaces';
import { SecuritizeService } from './securitize.service';

@Controller()
export class SecuritizeController {
  constructor(private securitizeService: SecuritizeService) {}

  @Post('kyc/:id')
  async hookKyc(@Body() body: any) {
    Logger.log(body);
    return 'ok';
  }

  @Get('staking')
  async getInvestorInfo(@Res() res: Response, @User() user: IUserInterface) {
    const result = await this.securitizeService.getInvestorInfo(user.data.securitizeId);
    return res.status(200).send({
      data: result,
    });
  }
}
