import { Controller, Get, Post } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { ProfileEntity } from '@DB/models/Profile.entity';
import { ProfileService } from '../services';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getHello(@User() user: IIdentityModel): Promise<ProfileEntity> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.profileService.getById(mockUser.profileId);
  }

  @Post()
  postHello() {
    return 'Hello';
  }
}
