/* eslint-disable max-len */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { paginate } from '@Common/utils/pagination.util';
import { ACCOUNT_TYPES, HISTORY_TYPES } from '@DB/enums';
import { fn } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  BlockchainIdentityAddressModel,
  BlockchainModel,
  CollectionModel,
  IdentityModel,
  IdentityNftBalanceModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NftLikeModel,
  NftModel,
  OrdersModel,
  PodcastModel,
  ProfileModel,
  TransactionHistoryModel,
} from '@/db/models';
import { INftQueryDto } from './dtos/nft-query.dto';
import { upsertData } from '@/db/utils/helper';
import { IIdentityModel, INftModel, IProfileModel } from '@/db/interfaces';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { config } from '@/common/config';
import { countHelper } from '@/common/utils';
import { IUserInterface } from '@/common/interfaces';
import { getNftSelect } from './selects';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(NftModel) private repository: typeof NftModel,
    @InjectModel(NftLikeModel)
    private nftLikeModel: typeof NftLikeModel,
    @InjectModel(LibraryModel)
    private libraryModel: typeof LibraryModel,
    @InjectModel(PodcastModel)
    private podcastModel: typeof PodcastModel,
    @InjectModel(NewsModel)
    private newsModel: typeof NewsModel,
    @InjectModel(NewsLikeModel)
    private newsLikeModel: typeof NewsLikeModel,
    @InjectModel(BlockchainIdentityAddressModel)
    private blockchainIdentityAddressModel: typeof BlockchainIdentityAddressModel,
    @InjectModel(TransactionHistoryModel)
    private transactionHistoryModel: typeof TransactionHistoryModel,
    @InjectModel(IdentityModel)
    private identityModel: typeof IdentityModel,
    @InjectModel(ProfileModel)
    private profileModel: typeof ProfileModel,
    @InjectModel(OrdersModel)
    private orderModel: typeof OrdersModel,
    @InjectModel(IdentityNftBalanceModel)
    private identityNftBalanceModel: typeof IdentityNftBalanceModel,
  ) {}

  async getAll(searchData?: INftQueryDto, profileId?: number) {
    try {
      const [data] = await this.repository.sequelize.query(getNftSelect(searchData, profileId));
      const { total, result } = countHelper(data);
      return {
        data: result,
        pagination: {
          total,
          limit: searchData.limit,
          offset: searchData.offset,
        },
      };
    } catch (e) {
      Logger.error('Error nft service', e);
      throw e;
    }
  }

  /**
   * fill nfts after add collection, only ones
   * @param nfts
   */
  public async fillNftsByCollection(nfts: INftModel[], identityId?: string) {
    const { tableName } = this.repository;
    if (nfts && nfts.length) {
      //  add nfts
      const nftsQuery = upsertData(
        tableName,
        [
          'id',
          'collectionId',
          'thumbnail',
          'amount',
          'metadata',
          'creatorIds',
          'royaltyIds',
          'royalty',
          'totalSupply',
        ],
        nfts.map((nft: INftModel) => [
          `'${nft.id}','${nft.collectionId}','${nft.thumbnail}','${nft.amount}', '${JSON.stringify(
            nft.metadata,
          )}', '${JSON.stringify(nft.creatorIds)}','${JSON.stringify(nft.royaltyIds)}',${
            nft.royalty
          }, '${nft.totalSupply}'`,
        ]),
      );
      await this.repository.sequelize.query(nftsQuery);

      // add balances
      const balancesQuery = upsertData(
        'IdentityNftBalance',
        ['id', 'identityId', 'nftId', 'amount'],
        nfts.map((nft: INftModel) => [
          `'${getShortHash(identityId, nft.id)}','${identityId}','${nft.id}','${nft.ownerBalance}'`,
        ]),
      );
      await this.repository.sequelize.query(balancesQuery);

      // add creators
      const creatorsQuery = upsertData(
        'IdentityNftCreator',
        ['address', 'nftId'],
        nfts.map((cr: INftModel) => [`'${cr.creatorIds[0]}','${cr.id}'`]),
      );

      await this.repository.sequelize.query(creatorsQuery);
      console.log();
    }
  }

  async getNftInfo(
    type: 'libraries' | 'podcast' | 'news',
    pagination: { limit?: number; offset?: number },
    viewerUser?: IUserInterface['data'] | null,
  ): Promise<any> {
    const { limit, offset } = pagination;
    const artemundiIdentity = await this.getArtemundiIdentity();
    const modelsMap = {
      libraries: this.libraryModel,
      podcast: this.podcastModel,
      news: this.newsModel,
    };
    // eslint-disable-next-line security/detect-object-injection
    let result: any = await paginate(modelsMap[type], {
      where: { profileId: artemundiIdentity.profileId },
      limit,
      offset,
    });
    if (type === 'news') {
      const listOfNewsLikesCount = await this.getAllNewsLikeCounts();
      let listOfAllNewsIdsLikedByUser: NewsModel[] = [];
      if (viewerUser) {
        listOfAllNewsIdsLikedByUser = await this.getAllNewsLikesListByProfileId(
          viewerUser.profileId,
        );
      }

      result = await Promise.all(
        result.data.map(async (news: NewsModel) =>
          this.injectLikesToNewsRecord(news, listOfNewsLikesCount, listOfAllNewsIdsLikedByUser),
        ),
      );
    }
    return result;
  }

  async getCommunityLinkForMarketplace(): Promise<string> {
    const artemundiIdentity = await this.getArtemundiIdentity();
    return artemundiIdentity.profile.communityLink;
  }

  async getHistoryByNftId(nftId: string) {
    const historyRecords = await this.transactionHistoryModel.findAll({
      where: { nftId },
      attributes: ['type', 'amount', 'price', 'txHash', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: this.identityModel,
          as: 'identity',
          attributes: ['accountType'],
          include: [
            {
              model: this.profileModel,
              as: 'profile',
              attributes: ['id', 'avatar', 'userName'],
            },
            {
              model: this.blockchainIdentityAddressModel,
              as: 'address',
            },
          ],
        },
      ],
    });

    return historyRecords.map((historyRecord: any) => {
      // eslint-disable-next-line no-param-reassign
      historyRecord.dataValues.identity = this.formatIdentityData(
        historyRecord.dataValues.identity,
      );
      return historyRecord;
    });
  }

  formatIdentityData(identity: any): {
    id: string;
    profileId: string;
    address: string;
    userName: string;
    isPartner: boolean;
    avatar: string;
  } {
    return {
      id: identity.id,
      profileId: identity.profile.id,
      address: identity.address[0].address,
      userName: identity.profile.userName,
      isPartner: identity.accountType === ACCOUNT_TYPES.PARTNER,
      avatar: identity.profile.avatar,
    };
  }

  async likeById(nftId: string, profileId: number) {
    const isLiked: boolean = await this.isLiked(nftId, profileId);
    if (isLiked) {
      throw new HttpException('ALREADY_LIKED', HttpStatus.BAD_REQUEST);
    }

    await this.nftLikeModel.create({ profileId, nftId });
  }

  async unLikeById(nftId: string, profileId: number) {
    const nftLikeRecord = await this.nftLikeModel.findOne({
      where: { profileId, nftId },
      attributes: ['id'],
    });

    if (!nftLikeRecord) {
      throw new HttpException('NOT_LIKED_YET', HttpStatus.BAD_REQUEST);
    }

    await nftLikeRecord.destroy();
  }

  async isLiked(nftId: string, profileId: number) {
    const nftLikeRecord = await this.nftLikeModel.findOne({
      where: { profileId, nftId },
      attributes: ['id'],
      raw: true,
    });
    return !!nftLikeRecord;
  }

  // ToDo move this and the same code to service, when circular dependencies are resolved
  async injectLikesToNewsRecord(
    newsRecord: any,
    listOfNewsLikesCount: any,
    listOfAllNewsIdsLikedByUser: any,
  ) {
    const result = newsRecord;
    result.isLiked = false;

    if (listOfAllNewsIdsLikedByUser) {
      result.isLiked = listOfAllNewsIdsLikedByUser.includes(newsRecord.dataValues.id);
    }

    result.likesCount = listOfNewsLikesCount[newsRecord.dataValues.id]
      ? listOfNewsLikesCount[newsRecord.dataValues.id]
      : 0;

    return result;
  }

  async getAllNewsLikeCounts() {
    const allCountsList: any[] = await this.newsLikeModel.findAll({
      attributes: ['newsId', 'profileId', [fn('COUNT', 'profileId'), 'likesCount']],
      group: ['newsId'],
    });

    let formattedCountsObject;
    if (allCountsList.length) {
      formattedCountsObject = {};
      allCountsList.forEach((item: any) => {
        formattedCountsObject[item.newsId] = item.dataValues.likesCount;
      });
    }

    return formattedCountsObject;
  }

  // get array containing all newsIds liked by current user
  async getAllNewsLikesListByProfileId(profileId: number) {
    return this.newsLikeModel
      .findAll({
        where: { profileId },
        attributes: ['newsId'],
      })
      .then((allNews: Pick<NewsLikeModel, 'newsId'>[]) =>
        allNews.map((newsRecord: Pick<NewsLikeModel, 'newsId'>) => newsRecord.newsId),
      );
  }

  async getArtemundiIdentity() {
    const artemundiWalletRecord = await this.blockchainIdentityAddressModel.findOne({
      where: { address: config.blockChain.artemundiWallet },
      include: [
        { model: IdentityModel, as: 'identity', include: [{ model: ProfileModel, as: 'profile' }] },
      ],
    });

    return artemundiWalletRecord.identity;
  }

  async getTotalStatsByIdentityId(user: IUserInterface['data']) {
    const historyTotalPrices = await this.transactionHistoryModel.findAll({
      where: { type: HISTORY_TYPES.BUY, identityId: user.id },
      attributes: [[Sequelize.fn('sum', Sequelize.col('price')), 'price']],
      group: ['nft.collection.blockchain.name'],
      include: [
        {
          model: NftModel,
          attributes: ['id', 'collectionId'],
          include: [
            {
              model: CollectionModel,
              attributes: ['chainId'],
              include: [
                {
                  model: BlockchainModel,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });
    const totalValue = {};
    if (historyTotalPrices.length) {
      historyTotalPrices.forEach((item: Partial<TransactionHistoryModel>) => {
        totalValue[item.nft.collection.blockchain.name] = { value: item.price };
      });
    }

    const balances = await this.identityNftBalanceModel.findAll({
      where: { identityId: user.id },
      include: [
        {
          model: OrdersModel,
          attributes: [
            [Sequelize.fn('sum', Sequelize.col('orders.amount')), 'totalAmount'],
            [Sequelize.fn('sum', Sequelize.col('orders.price')), 'totalPrice'],
          ],
        },
        {
          model: NftModel,
          attributes: ['id', 'collectionId'],
          include: [
            {
              model: CollectionModel,
              attributes: ['chainId'],
              include: [
                {
                  model: BlockchainModel,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });

    const totalWorth = {};
    if (balances?.length) {
      balances.forEach((balance: IdentityNftBalanceModel) => {
        if (totalValue[balance.nft.collection.blockchain.name]?.amount) {
          totalValue[balance.nft.collection.blockchain.name].amount += balance.amount;
        } else if (totalValue[balance.nft.collection.blockchain.name]) {
          totalValue[balance.nft.collection.blockchain.name].amount = balance.amount;
        } else {
          totalValue[balance.nft.collection.blockchain.name] = { amount: balance.amount };
        }
        if (balance?.orders.length) {
          balance.orders.forEach((order: OrdersModel) => {
            if (totalWorth[balance.nft.collection.blockchain.name]) {
              totalWorth[balance.nft.collection.blockchain.name].amount +=
                order.toJSON().totalAmount;
              totalWorth[balance.nft.collection.blockchain.name].value += order.toJSON().totalPrice;
            } else {
              totalWorth[balance.nft.collection.blockchain.name] = {
                amount: order.toJSON().totalAmount,
                value: order.toJSON().totalPrice,
              };
            }
          });
        }
      });
    }

    return {
      value: totalValue,
      worth: totalWorth,
    };
  }
}
