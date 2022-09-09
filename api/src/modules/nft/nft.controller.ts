import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@/common/decorators';
import { NftService } from './nft.service';
import { INftQueryDto } from './dtos/nft-query.dto';
import { RabbitRootService } from '../rabbit/rabbit-root.service';

@Controller()
export class NftController {
  constructor(private nftService: NftService, private rabbit: RabbitRootService) {}

  @Public()
  @Get()
  async getAll(@Res() res: Response, @Query() query: INftQueryDto) {
    try {
      const result = await this.nftService.getAll(query);
      return res.status(200).send({
        data: result,
      });
    } catch (e) {
      Logger.error(e);
      return res.send('error');
    }
  }
}
