import { Body, Controller, Get, Logger, Post } from '@nestjs/common';

@Controller()
export class SecuritizeController {
  @Post('kyc/:id')
  async hookKyc(@Body() body: any) {
    Logger.log(body);
    return 'ok';
  }
}
