import { Controller, Get, Post } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { ProfileService } from '../services';

@Controller()
export class ProfileController {
  constructor(private readonly appService: ProfileService) {}

  @Get()
  getHello(@User() user: IIdentityModel): string {
    console.log('scv_req', user);
    return this.appService.getHello();
  }

  @Post()
  postHello() {
    return 'Hello';
  }
}
