import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { ProfileEntity } from '@DB/models/Profile.entity';
import { EditProfileDto } from '@Modules/profile/dtos/editProfileDto.dto';
import { ProfileService } from '../services';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getMy(@User() user: IIdentityModel): Promise<ProfileEntity> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.profileService.getById(mockUser.profileId);
  }

  @Patch()
  editMy(@User() user: IIdentityModel, @Body() body: EditProfileDto): Promise<{ success: true }> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.profileService.updateById(mockUser.id, body);
  }
}
