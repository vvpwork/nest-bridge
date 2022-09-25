/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  AssetsType,
  Blockchains,
  IDashboardStatsQueryDto,
  IPortfolioQueryDto,
} from '@Modules/dashboard/dtos';
import { IUserInterface } from '@Common/interfaces';
import { paginate } from '@Common/utils';
import { Sequelize } from 'sequelize-typescript';
import { ACCOUNT_TYPES, HISTORY_TYPES } from '@DB/enums';
import { BlockchainIdentityAddressModel, TransactionHistoryModel } from '@/db/models';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(TransactionHistoryModel) private historyModel: typeof TransactionHistoryModel,
  ) {}

  async getPortfolio(user: IUserInterface['data'], query: IPortfolioQueryDto) {
    const { limit, offset, blockchain, asset } = query;

    const options = this.hydrateOptionsForFilters(
      {
        where: { identityId: user.id },
        limit,
        offset,
      },
      { blockchain, asset },
    );

    return paginate(this.historyModel, options);
  }

  async getStats(user: IUserInterface['data'], query: IDashboardStatsQueryDto) {
    const { asset, blockchain } = query;

    const options = this.hydrateOptionsForFilters(
      {
        where: { identityId: user.id },
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
          [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
          [Sequelize.fn('sum', Sequelize.col('price')), 'price'],
        ],
        group: ['date'],
        order: [['date', 'DESC']],
      },
      { blockchain },
    );

    const stakedAssetsStats = await this.getStatsByOptions(options, 'staked');
    if (asset && asset === AssetsType.staked) {
      return stakedAssetsStats;
    }

    let nftStats;
    if (user.accountType !== ACCOUNT_TYPES.PARTNER) {
      nftStats = await this.getStatsByOptions(options, 'nft');
    } else {
      nftStats = await this.historyModel.findAll({
        where: { type: HISTORY_TYPES.LIST, identityId: user.id },
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
          [Sequelize.fn('sum', Sequelize.col('price')), 'price'],
          [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
        ],
        group: ['date'],
      });
    }

    const digitalSecuritiesStats = await this.getStatsByOptions(options, 'digitalSecurity');

    return {
      assets: stakedAssetsStats,
      securities: digitalSecuritiesStats,
      nfts: nftStats,
    };
  }

  async getStatsByOptions(options: any, assetType: 'staked' | 'digitalSecurity' | 'nft') {
    const newOptions = options;
    switch (assetType) {
      case 'staked': {
        newOptions.where = {
          ...newOptions.where,
          type: [HISTORY_TYPES.STAKE],
          data: { isClaimed: false },
        };
        break;
      }

      case 'digitalSecurity': {
        newOptions.where = {
          ...newOptions.where,
          type: [HISTORY_TYPES.BUY_DIGITAL_SECURITY],
          data: { isClaimed: false },
        };
        break;
      }

      case 'nft':
      default: {
        newOptions.where = { ...newOptions.where, type: HISTORY_TYPES.BUY };
        break;
      }
    }

    return this.historyModel.findAll(newOptions);
  }

  hydrateOptionsForFilters(
    options: any,
    filters: { asset?: AssetsType; blockchain?: Blockchains },
  ) {
    const newOptions = options;
    const { asset, blockchain } = filters;
    if (asset) {
      switch (asset) {
        case AssetsType.digitalSecurity: {
          const where = {
            ...options.where,
            type: HISTORY_TYPES.BUY_DIGITAL_SECURITY,
            data: { isClaimed: false },
          };
          newOptions.where = where;
          break;
        }

        case AssetsType.staked: {
          const where = { ...options.where, type: HISTORY_TYPES.STAKE, data: { isClaimed: false } };
          newOptions.where = where;
          break;
        }

        default: {
          const where = { ...options.where, type: HISTORY_TYPES.STAKE, data: { isClaimed: false } };
          newOptions.where = where;
        }
      }
    }

    if (blockchain) {
      switch (blockchain) {
        case Blockchains.ethereum: {
          newOptions.include = [
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
          newOptions.include = [
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
    return newOptions;
  }
}
