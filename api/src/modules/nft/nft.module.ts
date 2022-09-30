import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BlockchainIdentityAddressModel,
  IdentityModel,
  IdentityNftBalanceModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NftLikeModel,
  NftModel,
  OrdersModel,
  PodcastModel,
  ProfileModel,
  TransactionHistoryModel,
} from '@DB/models';
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
      OrdersModel,
      IdentityNftBalanceModel,
    ]),
    RabbitModule,
  ],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
