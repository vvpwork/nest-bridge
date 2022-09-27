import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Post,
  Req,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IProfileModel } from '@DB/interfaces';
import {
  EditProfileDto,
  IProfileDetailedResponseDto,
  IProfileFollowResponseDto,
  IProfileLibrariesResponseDto,
  IProfileNewsResponseDto,
  IProfilePodcastResponseDto,
  IProfileResponse,
  IProfileResponseDto,
} from '@Modules/profile/dtos/';
import { PaginationQueryDto } from '@Common/dto/paginationQuery.dto';
import { Public } from '@Common/decorators';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUserInterface, IUserRequest } from '@Common/interfaces';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ProfileService } from './profile.service';

@ApiTags('Profiles')
@Controller()
export class ProfileController {
  private cloudinary: CloudinaryService;
  constructor(private readonly profileService: ProfileService) {
    this.cloudinary = new CloudinaryService();
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get authorized user profile',
    type: IProfileResponse,
  })
  async getMy(@User() user: IUserInterface, @Res() res: Response) {
    const result = await this.profileService.getById(user.data.id);
    return res.status(200).send({
      data: result,
    });
  }

  @Get(':userNameOrAddress')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'get profile by username or address',
    type: IProfileDetailedResponseDto,
  })
  async getByUserNameOrAddress(
    @Param('userNameOrAddress') userNameOrAddress: string,
    @User() user: IUserInterface,
    @Res() res: Response,
  ) {
    const result = await this.profileService.getByUserNameOrAddress(userNameOrAddress, user.data);
    return res.status(200).send({
      ...result,
    });
  }

  @Patch()
  @ApiResponse({
    status: 200,
    description: 'successful',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async editMy(
    @User() user: IUserInterface,
    @Body() body: EditProfileDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const params: any = {
      ...body,
    };
    // upload images to cloudinary
    const [cover, avatar] = await Promise.allSettled([
      this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'cover')),
      this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'avatar')),
    ]);

    if (cover.status === 'fulfilled') {
      params.cover = cover.value.url;
    }

    if (avatar.status === 'fulfilled') {
      params.avatar = avatar.value.url;
    }

    return res.status(200).send({
      data: await this.profileService.updateById(user.data.profileId, params as IProfileModel),
    });
  }

  @Get(':id/libraries')
  @ApiResponse({
    status: 200,
    description: 'Get all libraries of target profile',
    type: IProfileLibrariesResponseDto,
  })
  @Public()
  async getLibraries(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @Res() res: Response,
  ) {
    return res.status(200).send({
      data: await this.profileService.getResourcesByProfileId(
        'libraries',
        id,
        query.limit,
        query.offset,
      ),
    });
  }

  @Get(':id/podcasts')
  @ApiResponse({
    status: 200,
    description: 'Get all podcasts of target profile',
    type: IProfilePodcastResponseDto,
  })
  @Public()
  async getPodcasts(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @Res() res: Response,
  ) {
    return res.status(200).send({
      data: await this.profileService.getResourcesByProfileId(
        'podcasts',
        id,
        query.limit,
        query.offset,
      ),
    });
  }

  @Get(':id/news')
  @ApiResponse({
    status: 200,
    description: 'Get all news of target profile',
    type: IProfileNewsResponseDto,
  })
  @Public()
  async getNews(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @Req() request: IUserRequest,
    @Res() res: Response,
  ) {
    return res.status(200).send({
      data: await this.profileService.getResourcesByProfileId(
        'news',
        id,
        query.limit,
        query.offset,
        request?.user?.data,
      ),
    });
  }

  @Get(':id/followers')
  @ApiResponse({
    status: 200,
    description: 'Get all followers of target profile',
    type: IProfileFollowResponseDto,
  })
  @Public()
  async getFollowersList(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @User() user: IUserInterface,
    @Req() request: IUserRequest,
    @Res() res: Response,
  ) {
    return res.status(200).send({
      data: await this.profileService.getFollowList(
        'followers',
        id,
        user.data,
        query.limit,
        query.offset,
      ),
    });
  }

  @Get(':id/followings')
  @ApiResponse({
    status: 200,
    description: 'Get all users which target profile is following',
    type: IProfileFollowResponseDto,
  })
  @Public()
  async getFollowingsList(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @User() user: IUserInterface,
    @Req() request: IUserRequest,
    @Res() res: Response,
  ) {
    return res.status(200).send({
      data: await this.profileService.getFollowList(
        'followings',
        id,
        user.data,
        query.limit,
        query.offset,
      ),
    });
  }

  @Post(':id/follow')
  @ApiResponse({
    status: 201,
    description: 'Follow target profile',
  })
  async followByProfileId(
    @User() user: IUserInterface,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return res.status(201).send({
      data: await this.profileService.followByProfileId(user.data.profileId, id),
    });
  }

  @Post(':id/unfollow')
  @ApiResponse({
    status: 201,
    description: 'unFollow target profile',
  })
  async unFollowByProfileId(
    @User() user: IUserInterface,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return res.status(201).send({
      data: await this.profileService.unFollowByProfileId(user.data.profileId, id),
    });
  }
}
