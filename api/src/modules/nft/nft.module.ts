import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NftLikeModel, NftModel } from '@/db/models';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { RabbitModule } from '../rabbit';

@Module({
  imports: [SequelizeModule.forFeature([NftModel, NftLikeModel]), RabbitModule],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
