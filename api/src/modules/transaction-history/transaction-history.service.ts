/* eslint-disable no-param-reassign */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TypeSseMessage } from '../sse/enums';
import { TransactionHistoryModel } from '@/db/models';
import { ITransactionHistory } from '@/db/interfaces';
import { IUserInterface } from '@/common/interfaces';
import { ACCOUNT_TYPES, HISTORY_TYPES } from '@/db/enums';
import { getNftHistorySelect, getPnlHistorySelect, getStakedHistorySelect } from './selects';
import { IGetStakeHistoryQuery } from './dtos/get-stakedhistory.dto';
import { countHelper } from '@/common/utils';
import { SseService } from '../sse/sse.service';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectModel(TransactionHistoryModel) private historyModel: typeof TransactionHistoryModel,
    private sseService: SseService,
  ) {}

  async create(data: Partial<ITransactionHistory>) {
    this.sseService.addEvent({ type: TypeSseMessage.ORDER_BUY, data });
    return this.historyModel.create(data);
  }

  async geNftHistoryAmountByUSDC(user: IUserInterface['data']) {
    const [data] = await this.historyModel.sequelize.query(
      getNftHistorySelect(
        user.id,
        user.accountType === ACCOUNT_TYPES.PARTNER ? HISTORY_TYPES.LIST : HISTORY_TYPES.BUY,
      ),
    );
    return data[0];
  }

  async getStakedHistory(user: IUserInterface['data'], query: IGetStakeHistoryQuery) {
    const [data] = await this.historyModel.sequelize.query(getStakedHistorySelect(user.id, query));
    const { total, result } = countHelper(data);
    return {
      data: result,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }

  async getPnlHistory(user: IUserInterface['data']) {
    const [data]: any = await this.historyModel.sequelize.query(
      getPnlHistorySelect(
        user.id,
        user.accountType === ACCOUNT_TYPES.PARTNER ? HISTORY_TYPES.LIST : HISTORY_TYPES.BUY,
      ),
    );

    return data;
  }
}
