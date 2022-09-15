import { Controller, Get, Res } from '@nestjs/common';
import { Public } from '@/common/decorators';

@Controller()
export class ConfigApiController {
  @Public()
  @Get()
  async get(@Res() res: Response) {
    return 'Ok';
  }
}
