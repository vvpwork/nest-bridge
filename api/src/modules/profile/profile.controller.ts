import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@DB/interfaces';
import { EditProfileDto } from '@Modules/profile/dtos/';
import { PaginationQueryDto } from '@Common/utils/paginationQuery.dto';
import { Public } from '@Common/decorators';
import { ProfileModel } from '@/db/models/profile.model';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getMy(@User() user: IIdentityModel): Promise<ProfileModel> {
    return this.profileService.getById(user.profileId);
  }

  @Patch()
  async editMy(@User() user: IIdentityModel, @Body() body: EditProfileDto): Promise<{ success: true }> {
    return this.profileService.updateById(user.profileId, body);
  }

  @Public()
  @Get(':id/libraries')
  async getLibraries(@Param('id') id: number, @Query() query: PaginationQueryDto): Promise<any> {
    return this.profileService.getLibrariesByProfileId(id, query.limit, query.offset);
  }

  @Public()
  @Get(':id/podcasts')
  async getPodcasts(@Param('id') id: number, @Query() query: PaginationQueryDto): Promise<any> {
    return this.profileService.getPodcastsByProfileId(id, query.limit, query.offset);
  }
}
