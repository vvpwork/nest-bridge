import { Controller, Delete, Get, Logger, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUserInterface, IUserRequest } from '@Common/interfaces';
import {
  IProfileLibrariesResponseDto,
  IProfileNewsResponseDto,
  IProfilePodcastResponseDto,
} from '@Modules/profile/dtos';
import { PaginationQueryDto } from '@Common/dto/paginationQuery.dto';
import { ICommunityLinkResponseDto } from '@Modules/nft/dtos/communityLink-response.dto';
import { INftHistoryResponseDto } from '@Modules/nft/dtos/nftHistory-responese.dto';
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
  @ApiResponse({
    status: 200,
    description: 'successfully liked',
  })
  async like(@Param('id') id: string, @User() user: IUserInterface, @Res() res: Response): Promise<void> {
    res.status(200).send({
      data: await this.nftService.likeById(id, user.data.profileId),
    });
  }

  @Delete(':id/like')
  @ApiResponse({
    status: 200,
    description: 'successfully removed like',
  })
  async unLike(@Param('id') id: string, @User() user: IUserInterface, @Res() res: Response): Promise<void> {
    res.status(200).send({
      data: await this.nftService.unLikeById(id, user.data.profileId),
    });
  }

  @Get('/library')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get libraries list',
    type: IProfileLibrariesResponseDto,
  })
  async getLibraries(@Param('id') id: number, @Query() query: PaginationQueryDto, @Res() res: Response) {
    res.status(200).send({
      data: await this.nftService.getNftInfo('libraries', query),
    });
  }

  @Get('/podcasts')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get podcasts list',
    type: IProfilePodcastResponseDto,
  })
  async getPodcasts(@Param('id') id: number, @Query() query: PaginationQueryDto, @Res() res: Response) {
    res.status(200).send({
      data: await this.nftService.getNftInfo('podcast', query),
    });
  }

  @Get('/news')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get news list',
    type: IProfileNewsResponseDto,
  })
  async getNews(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
    @Res() res: Response,
    @Req() request: IUserRequest,
  ) {
    res.status(200).send({
      data: await this.nftService.getNftInfo('news', query, request?.user?.data),
    });
  }

  @Get('/community')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get marketplace community link',
    type: ICommunityLinkResponseDto,
  })
  async getCommunityLink(@Param('id') id: number, @Query() query: PaginationQueryDto, @Res() res: Response) {
    res.status(200).send({
      data: await this.nftService.getCommunityLinkForMarketplace(),
    });
  }

  @Get(':id/history')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'get history of nft',
    type: INftHistoryResponseDto,
  })
  async getNftHistory(@Param('id') id: string, @Res() res: Response): Promise<void> {
    res.status(200).send({
      data: await this.nftService.getHistoryByNftId(id),
    });
  }
}
