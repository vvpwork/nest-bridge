import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryModel } from '@/db/models';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([TransactionHistoryModel])],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
