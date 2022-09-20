import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CollectionModel, NftModel } from '@/db/models';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { BlockchainModule } from '../blockchain';
import { NftModule } from '../nft';

@Module({
  imports: [SequelizeModule.forFeature([CollectionModel, NftModel]), BlockchainModule, NftModule],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
