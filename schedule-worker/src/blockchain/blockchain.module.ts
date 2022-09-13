import { Global, Module } from '@nestjs/common';
import Web3 from 'web3';
import { BlockchainService } from './blockchain.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
