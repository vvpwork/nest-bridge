import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHistoryModel } from '@/db/models';
import { ITransactionHistory } from '@/db/interfaces';

@Injectable()
export class TransactionHistoryService {
  constructor(@InjectModel(TransactionHistoryModel) private historyModel: typeof TransactionHistoryModel) {}

  async create(data: Partial<ITransactionHistory>) {
    return this.historyModel.create(data);
  }
}
