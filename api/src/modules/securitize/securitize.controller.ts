import { Response } from 'express';
import { Body, Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { User } from '@/common/decorators';
import { IUserInterface } from '@/common/interfaces';
import { SecuritizeService } from './securitize.service';
import { IdentityService } from '../identity/identity.service';

@Controller()
export class SecuritizeController {
  constructor(
    private securitizeService: SecuritizeService,
    private identityService: IdentityService,
  ) {}

  @Post('kyc/:id')
  async hookKyc(@Body() body: any, @Param() param: { id: string }) {
    Logger.log(body);
    // TODO testing what the data will come from securitize
    // this.identityService.updateById(param.id, { status: body.status });
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
