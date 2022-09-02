import { SEQUELIZE } from '@Common/constants';
import { config } from '@Common/config';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';
import {
  IdentityEntity,
  LibraryEntity,
  ProfileEntity,
  NotificationEntity,
  FollowerEntity,
  NotificationTypeEntity,
  OrderEntity,
  TransactionHistoryEntity,
  NftEntity,
  NftLike,
  PodcastEntity,
  NewsLikeEntity,
  NewsEntity,
  IdentityNftBalanceLockEntity,
  IdentityNftBalanceStatusEntity,
  IdentityNftBalanceEntity,
  CollectionEntity,
  AccountTypeEntity,
  BlockchainEntity,
  TransactionHistoryTypeEntity,
} from '@DB/models';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        ...config.db,
        logging: Logger.log,
      });
      sequelize.addModels([
        IdentityEntity,
        LibraryEntity,
        ProfileEntity,
        NotificationEntity,
        FollowerEntity,
        NotificationTypeEntity,
        OrderEntity,
        TransactionHistoryEntity,
        NftEntity,
        NftLike,
        PodcastEntity,
        NewsLikeEntity,
        NewsEntity,
        IdentityNftBalanceLockEntity,
        IdentityNftBalanceStatusEntity,
        IdentityNftBalanceEntity,
        CollectionEntity,
        AccountTypeEntity,
        BlockchainEntity,
        TransactionHistoryTypeEntity,
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
