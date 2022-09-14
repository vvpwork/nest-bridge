import { Body, Controller, Delete, Param, Patch, Post, Get, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel, ILibraryModel, INewsModel } from '@DB/interfaces';
import { CreateLibraryDto, EditLibraryDto } from '@Modules/library/dtos';
import { NewsModel } from '@DB/models';
import { Public } from '@Common/decorators';
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNewsDto, INewsResponseDto } from '@Modules/news/dtos';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { IUserInterface } from '@Common/interfaces';
import { NewsService } from './news.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('News')
@Controller()
export class NewsController {
  private cloudinary: CloudinaryService;

  constructor(private readonly newsService: NewsService, private readonly authService: AuthService) {
    this.cloudinary = new CloudinaryService();
  }

  @ApiResponse({
    status: 200,
    description: 'News record was created',
    type: INewsResponseDto,
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async create(
    @User() user: IUserInterface,
    @Body() body: CreateNewsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<NewsModel> {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    return this.newsService.create({ profileId: user.data.profileId, ...body, image: imageUrl } as INewsModel);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Body() body: EditLibraryDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ success: true }> {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    return this.newsService.update(id, { ...body, image: imageUrl } as INewsModel);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: true }> {
    return this.newsService.delete(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Get news record data',
    type: INewsResponseDto,
  })
  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string, @Req() request: Request): Promise<NewsModel> {
    const user = await this.authService.getUserFromReqHeaders(request);
    return this.newsService.getOneById(id, user);
  }
}
