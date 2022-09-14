import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BlockchainIdentityAddressModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NftLikeModel,
  NftModel,
  PodcastModel,
} from '@/db/models';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { RabbitModule } from '../rabbit';

@Module({
  imports: [
    SequelizeModule.forFeature([
      NftModel,
      NftLikeModel,
      PodcastModel,
      LibraryModel,
      NewsModel,
      NewsLikeModel,
      BlockchainIdentityAddressModel,
    ]),
    RabbitModule,
  ],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
