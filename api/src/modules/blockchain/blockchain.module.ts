import { Module } from '@nestjs/common';
import Web3 from 'web3';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BlockchainService],
})
export class BlockchainModule {}
