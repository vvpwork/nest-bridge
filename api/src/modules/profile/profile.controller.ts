import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { ProfileEntity } from '@DB/models/Profile.entity';
import { EditProfileDto } from '@Modules/profile/dtos/';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get() // ToDo add auth guard
  getMy(@User() user: IIdentityModel): Promise<ProfileEntity> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.profileService.getById(mockUser.profileId);
  }

  @Patch() // ToDo add auth guard
  editMy(@User() user: IIdentityModel, @Body() body: EditProfileDto): Promise<{ success: true }> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.profileService.updateById(mockUser.id, body);
  }
}
