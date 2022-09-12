import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CollectionModel, NftModel } from '@/db/models';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { BlockchainModule } from '../blockchain';

@Module({
  imports: [SequelizeModule.forFeature([CollectionModel, NftModel]), BlockchainModule],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
