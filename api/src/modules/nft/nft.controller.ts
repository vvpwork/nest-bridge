import { Controller, Delete, Get, Logger, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUserInterface, IUserRequest } from '@Common/interfaces';
import { PaginationQueryDto } from '@Common/utils/paginationQuery.dto';
import { IProfileLibrariesResponseDto, IProfileNewsResponseDto } from '@Modules/profile/dtos';
import { Public, User } from '@/common/decorators';
import { NftService } from './nft.service';
import { INftQueryDto } from './dtos/nft-query.dto';
import { RabbitRootService } from '../rabbit/rabbit-root.service';
import { INftResponse } from './dtos/nft-responese.dto';

@ApiTags('Nft')
@Controller()
export class NftController {
  constructor(private nftService: NftService, private rabbit: RabbitRootService) {}

  @Public()
  @Get()
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiResponse({
    status: 200,
    description: 'Request was succeed',
    type: INftResponse,
  })
  async getAll(@Res() res: Response, @Query() query: INftQueryDto) {
    try {
      const result = await this.nftService.getAll(query);
      return res.status(200).send({
        ...result,
      });
    } catch (e) {
      Logger.error(e);
      return res.send('error');
    }
  }

  @Post(':id/like')
  async like(@Param('id') id: string, @User() user: IUserInterface): Promise<void> {
    return this.nftService.likeById(id, user.data.profileId);
  }

  @Delete(':id/like')
  async unLike(@Param('id') id: string, @User() user: IUserInterface): Promise<void> {
    return this.nftService.unLikeById(id, user.data.profileId);
  }

  @Public()
  @Get('/library')
  async getLibraries(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
  ): Promise<IProfileLibrariesResponseDto> {
    return this.nftService.getLibrariesForMarketplace(query.limit, query.offset);
  }

  @Public()
  @Get('/podcasts')
  async getPodcasts(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
  ): Promise<IProfileLibrariesResponseDto> {
    return this.nftService.getPodcastsForMarketplace(query.limit, query.offset);
  }

  @Public()
  @Get('/news')
  async getNews(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @Req() request: IUserRequest,
  ): Promise<IProfileNewsResponseDto> {
    return this.nftService.getNewsForMarketplace(request?.user?.data, query.limit, query.offset);
  }

  @Public()
  @Get('/community')
  async getCommunityLink(@Param('id') id: number, @Query() query: PaginationQueryDto): Promise<string> {
    return this.nftService.getCommunityLinkForMarketplace();
  }
}
