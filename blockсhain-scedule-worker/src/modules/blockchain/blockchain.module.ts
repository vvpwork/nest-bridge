import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Web3 from 'web3';
import { NftModel } from '@/db/models';
import { BlockchainService } from './blockchain.service';
import { BlockchainRabbitService, BlockchainUtilsService } from './services';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([NftModel])],
  controllers: [],
  providers: [
    BlockchainService,
    BlockchainRabbitService,
    BlockchainUtilsService,
  ],
  exports: [BlockchainService],
})
export class BlockchainModule {}
