import { Body, Controller, Get, Param, Patch, Query, Post, Req, Inject, forwardRef } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@DB/interfaces';
import {
  EditProfileDto,
  IProfileLibrariesResponseDto,
  IProfileNewsResponseDto,
  IProfilePodcastResponseDto,
} from '@Modules/profile/dtos/';
import { PaginationQueryDto } from '@Common/utils/paginationQuery.dto';
import { Public } from '@Common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { IUserInterface, IUserRequest } from '@Common/interfaces';
import { Request } from 'express';
import { ProfileModel } from '@/db/models/profile.model';
import { ProfileService } from './profile.service';

@ApiTags('Profiles')
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getMy(@User() user: IIdentityModel): Promise<ProfileModel> {
    return this.profileService.getById(user.profileId);
  }

  @Patch()
  async editMy(@User() user: IIdentityModel, @Body() body: EditProfileDto): Promise<{ success: boolean }> {
    return this.profileService.updateById(user.profileId, body);
  }

  @Public()
  @Get(':id/libraries')
  async getLibraries(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
  ): Promise<IProfileLibrariesResponseDto> {
    return this.profileService.getLibrariesByProfileId(id, query.limit, query.offset);
  }

  @Public()
  @Get(':id/podcasts')
  async getPodcasts(@Param('id') id: number, @Query() query: PaginationQueryDto): Promise<IProfilePodcastResponseDto> {
    return this.profileService.getPodcastsByProfileId(id, query.limit, query.offset);
  }

  @Public()
  @Get(':id/news')
  async getNews(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @Req() request: IUserRequest,
  ): Promise<IProfileNewsResponseDto> {
    return this.profileService.getNewsByProfileId(id, request?.user?.data, query.limit, query.offset);
  }

  @Post(':id/follow')
  async followByProfileId(@User() user: IUserInterface, @Param('id') id: number): Promise<{ success: boolean }> {
    return this.profileService.followByProfileId(user.data.profileId, id);
  }

  @Post(':id/unfollow')
  async unFollowByProfileId(@User() user: IUserInterface, @Param('id') id: number): Promise<{ success: boolean }> {
    return this.profileService.unFollowByProfileId(user.data.profileId, id);
  }
}
