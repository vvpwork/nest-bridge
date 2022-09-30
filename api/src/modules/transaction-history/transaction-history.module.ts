import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionHistoryModel } from '@DB/models';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';
import { BlockchainModule } from '../blockchain';

@Global()
@Module({
  controllers: [TransactionHistoryController],
  imports: [SequelizeModule.forFeature([TransactionHistoryModel]), BlockchainModule],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
