import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getHealthCheck(): Promise<string> {
    return 'ok';
  }
}
