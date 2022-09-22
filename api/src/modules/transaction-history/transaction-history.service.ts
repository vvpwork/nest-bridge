/* eslint-disable no-param-reassign */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HISTORY_TYPES } from '@DB/enums';
import { TransactionHistoryModel } from '@/db/models';
import { ITransactionHistory } from '@/db/interfaces';

@Injectable()
export class TransactionHistoryService {
  constructor(@InjectModel(TransactionHistoryModel) private historyModel: typeof TransactionHistoryModel) {}

  async create(data: Partial<ITransactionHistory>) {
    if (data.type === HISTORY_TYPES.STAKE) {
      data.data.isClaimed = false;
    }
    if (data.type === HISTORY_TYPES.CLAIM) {
      data.data.isClaimed = true;
    }

    return this.historyModel.create(data);
  }
}
