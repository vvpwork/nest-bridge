import { Body, Controller, Delete, Param, Patch, Post, Get, Req } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@DB/interfaces';
import { CreateLibraryDto, EditLibraryDto } from '@Modules/library/dtos';
import { NewsModel } from '@DB/models';
import { Public } from '@Common/decorators';
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { INewsResponseDto } from '@Modules/news/dtos';
import { NewsService } from './news.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('News')
@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService, private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'News record was created',
    type: INewsResponseDto,
  })
  @Post()
  async create(@User() user: IIdentityModel, @Body() body: CreateLibraryDto): Promise<NewsModel> {
    return this.newsService.create(user.profileId, body);
  }

  @Patch(':id')
  async update(@Body() body: EditLibraryDto, @Param('id') id: number): Promise<{ success: true }> {
    return this.newsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: true }> {
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
