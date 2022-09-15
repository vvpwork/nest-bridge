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
  IProfileLibrariesResponseDto,
  IProfileNewsResponseDto,
  IProfilePodcastResponseDto,
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
    type: IProfileResponseDto,
  })
  async getMy(@User() user: IUserInterface, @Res() res: Response) {
    res.status(200).send({
      data: await this.profileService.getById(user.data.profileId),
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

    if (cover && cover.status === 'fulfilled') {
      params.cover = cover.value.url;
    }

    if (avatar && avatar.status === 'fulfilled') {
      params.avatar = avatar.value.url;
    }

    res.status(200).send({
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
  async getLibraries(@Param('id') id: number, @Query() query: PaginationQueryDto, @Res() res: Response) {
    res.status(200).send({
      data: await this.profileService.getLibrariesByProfileId(id, query.limit, query.offset),
    });
  }

  @Get(':id/podcasts')
  @ApiResponse({
    status: 200,
    description: 'Get all podcasts of target profile',
    type: IProfilePodcastResponseDto,
  })
  @Public()
  async getPodcasts(@Param('id') id: number, @Query() query: PaginationQueryDto, @Res() res: Response) {
    res.status(200).send({
      data: await this.profileService.getPodcastsByProfileId(id, query.limit, query.offset),
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
    res.status(200).send({
      data: await this.profileService.getNewsByProfileId(id, request?.user?.data, query.limit, query.offset),
    });
  }

  @Post(':id/follow')
  @ApiResponse({
    status: 201,
    description: 'Follow target profile',
  })
  async followByProfileId(@User() user: IUserInterface, @Param('id') id: number, @Res() res: Response) {
    res.status(201).send({
      data: await this.profileService.followByProfileId(user.data.profileId, id),
    });
  }

  @Post(':id/unfollow')
  @ApiResponse({
    status: 201,
    description: 'unFollow target profile',
  })
  async unFollowByProfileId(@User() user: IUserInterface, @Param('id') id: number, @Res() res: Response) {
    res.status(201).send({
      data: await this.profileService.unFollowByProfileId(user.data.profileId, id),
    });
  }
}
