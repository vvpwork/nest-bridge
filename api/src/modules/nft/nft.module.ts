import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BlockchainIdentityAddressModel,
  IdentityModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NftLikeModel,
  NftModel,
  PodcastModel,
  ProfileModel,
  TransactionHistoryModel,
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
      TransactionHistoryModel,
      IdentityModel,
      ProfileModel,
    ]),
    RabbitModule,
  ],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
