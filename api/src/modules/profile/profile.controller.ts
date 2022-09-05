import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { Profile } from '@DB/models/Profile.entity';
import { EditProfileDto } from '@Modules/profile/dtos/';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getMy(@User() user: IIdentityModel): Promise<Profile> {
    return this.profileService.getById(user.profileId);
  }

  editMy(@User() user: IIdentityModel, @Body() body: EditProfileDto): Promise<{ success: true }> {
    return this.profileService.updateById(user.profileId, body);
  }
}
