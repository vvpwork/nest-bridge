/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetsType, Blockchains, IPortfolioQueryDto } from '@Modules/dashboard/dtos';
import { IUserInterface } from '@Common/interfaces';
import { paginate } from '@Common/utils';
import { TransactionsType } from '@Modules/transaction-history/dtos';
import { BlockchainIdentityAddressModel, TransactionHistoryModel } from '@/db/models';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(TransactionHistoryModel) private historyModel: typeof TransactionHistoryModel) {}

  async getPortfolio(user: IUserInterface['data'], query: IPortfolioQueryDto) {
    const { limit, offset, blockchain, asset } = query;

    const options = {
      where: { identityId: user.id },
      limit,
      offset,
    };
    if (asset) {
      switch (asset) {
        case AssetsType.digitalSecurity: {
          const where = { ...options.where, type: TransactionsType.buyDigitalSecurity, data: { isClaimed: false } };
          options.where = where;
          break;
        }

        case AssetsType.staked: {
          const where = { ...options.where, type: TransactionsType.stake, data: { isClaimed: false } };
          options.where = where;
          break;
        }

        default: {
          const where = { ...options.where, type: TransactionsType.stake, data: { isClaimed: false } };
          options.where = where;
        }
      }
    }

    if (blockchain) {
      // options['include'] =: [
      //   {
      //     model: BlockchainIdentityAddressModel,
      //   },
      // ],
      switch (blockchain) {
        case Blockchains.ethereum: {
          options['include'] = [
            {
              model: BlockchainIdentityAddressModel,
              attributes: ['chainId'],
              required: true,
              where: {
                chainId: [1, 3, 4, 5, 42],
              },
            },
          ];

          break;
        }

        case Blockchains.avalanche:
        default: {
          options['include'] = [
            {
              model: BlockchainIdentityAddressModel,
              attributes: ['chainId'],
              required: true,
              where: {
                chainId: [43113, 43114],
              },
            },
          ];

          break;
        }
      }
    }

    return paginate(this.historyModel, options);
  }
}
