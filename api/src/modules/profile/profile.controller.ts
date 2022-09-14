import { Body, Controller, Get, Param, Patch, Query, Post, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IProfileModel } from '@DB/interfaces';
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
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ProfileModel } from '@/db/models/profile.model';
import { ProfileService } from './profile.service';

@ApiTags('Profiles')
@Controller()
export class ProfileController {
  private cloudinary: CloudinaryService;
  constructor(private readonly profileService: ProfileService) {
    this.cloudinary = new CloudinaryService();
  }

  @Get()
  async getMy(@User() user: IUserInterface): Promise<ProfileModel> {
    return this.profileService.getById(user.data.profileId);
  }

  @Patch()
  @UseInterceptors(AnyFilesInterceptor())
  async editMy(
    @User() user: IUserInterface,
    @Body() body: EditProfileDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<void> {
    // upload images to cloudinary
    const [cover, avatar] = await Promise.allSettled([
      this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'cover')),
      this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'avatar')),
    ]);
    const coverUrl = cover.status === 'fulfilled' ? cover.value.url : '';
    const avatarUrl = avatar.status === 'fulfilled' ? avatar.value.url : '';

    return this.profileService.updateById(user.data.profileId, {
      ...body,
      cover: coverUrl,
      avatar: avatarUrl,
    } as IProfileModel);
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
