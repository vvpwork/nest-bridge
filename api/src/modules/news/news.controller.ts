import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  Req,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { INewsModel } from '@DB/interfaces';
import { EditLibraryDto } from '@Modules/library/dtos';
import { Public } from '@Common/decorators';
import { Response } from 'express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNewsDto, INewsResponseDto } from '@Modules/news/dtos';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { IUserInterface, IUserRequest } from '@Common/interfaces';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller()
export class NewsController {
  private cloudinary: CloudinaryService;

  constructor(private readonly newsService: NewsService) {
    this.cloudinary = new CloudinaryService();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'News created successfully',
    type: INewsResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @User() user: IUserInterface,
    @Body() body: CreateNewsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(
      files.find((v: Express.Multer.File) => v.fieldname === 'image'),
    );
    const imageUrl = image.url ? image.url : '';

    return res.status(201).send({
      data: await this.newsService.create({
        profileId: user.data.profileId,
        ...body,
        image: imageUrl,
      } as INewsModel),
    });
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({
    status: 200,
    description: 'successfully edited news record',
  })
  @ApiConsumes('multipart/form-data')
  async update(
    @Body() body: EditLibraryDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const params: any = { ...body };
    if (!body.image) {
      // upload images to cloudinary
      const image = await this.cloudinary.uploadFile(
        files.find((v: Express.Multer.File) => v.fieldname === 'image'),
      );
      if (image && image.url) {
        params.image = image.url;
      }
    }

    return res.status(200).send({
      data: await this.newsService.update(id, params as INewsModel),
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'successfully deleted',
  })
  async delete(@Param('id') id: string, @Res() res: Response) {
    return res.status(200).send({
      data: await this.newsService.delete(id),
    });
  }

  @Get(':id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get news record data',
    type: INewsResponseDto,
  })
  async getOne(@Param('id') id: string, @Req() request: IUserRequest, @Res() res: Response) {
    return res.status(200).send({
      data: await this.newsService.getOneById(id, request?.user?.data),
    });
  }

  @Post(':id/like')
  @ApiResponse({
    status: 200,
    description: 'successfully liked',
  })
  async like(@Param('id') id: string, @User() user: IUserInterface, @Res() res: Response) {
    return res.status(200).send({
      data: await this.newsService.likeById(id, user.data.profileId),
    });
  }

  @Delete(':id/like')
  @ApiResponse({
    status: 200,
    description: 'successfully removed like',
  })
  async unLike(@Param('id') id: string, @User() user: IUserInterface, @Res() res: Response) {
    return res.status(200).send({
      data: await this.newsService.unLikeById(id, user.data.profileId),
    });
  }
}
