/* eslint-disable no-param-reassign */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHistoryModel } from '@/db/models';
import { ITransactionHistory } from '@/db/interfaces';
import { IUserInterface } from '@/common/interfaces';
import { ACCOUNT_TYPES, HISTORY_TYPES } from '@/db/enums';
import { getNftHistorySelect, getPnlHistorySelect, getStakedHistorySelect } from './selects';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IGetStakeHistoryQuery } from './dtos/get-stakedhistory.dto';
import { countHelper } from '@/common/utils';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectModel(TransactionHistoryModel) private historyModel: typeof TransactionHistoryModel,
    private bcService: BlockchainService,
  ) {}

  async create(data: Partial<ITransactionHistory>) {
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
    let result = [];
    const [data]: any = await this.historyModel.sequelize.query(
      getPnlHistorySelect(
        user.id,
        user.accountType === ACCOUNT_TYPES.PARTNER ? HISTORY_TYPES.LIST : HISTORY_TYPES.BUY,
      ),
    );

    result = data;
    if (data.length) {
      try {
        // TODO remove after save balances to history
        const blocks = await this.bcService.getBlockByPeriod(user.address, {
          startDate: data[0].date,
          endDate: data[data.length - 1].date,
        });
        result = data.map((v: any) => ({
          ...v,
          balanceAvax: (() => {
            const block = blocks.find((b: any) => b.date.split('T')[0] === v.date);
            return block ? block.balance : '';
          })(),
        }));
        return result;
      } catch (err) {
        Logger.error(err, 'TrnHistory service get past balance');
      }
    }

    return result;
  }
}
