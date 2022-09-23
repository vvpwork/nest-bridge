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
      const { limit, offset, identityId, creatorId, collectionId, status, sortType, sortValue, nftId, search } =
        searchData;
      //  TODO refactor
      // One select for all nft requirements
      const rawQuery = `

      WITH temptable as (
        SELECT
        b.identityId as identityId,
        ident.status as status,
        ident.accountType,
        JSON_OBJECT('id', pr.id, 'cover', pr.cover, 'avatar', pr.avatar, 'name', pr.name ) as profile,
        n.id as nftId, 
        JSON_OBJECT('id', c.id, 'name', c.name, 'description', c.description, 'logo', c.logo, 'cover', c.cover, 'symbol', c.symbol ) as collection,
        n.royalty,
        n.metadata,
        n.amount  as totalNftAmount,
        n.thumbnail,
        cr.creatorsData,
        addr.address  as address,
        n.totalSupply, 
        n.creatorIds as creators,
        b.amount as identityBalance,
        l.lockedData,
        l.lockedBalance,
        IF(lik.count, lik.count, 0) as likesCount,
        IF(ll.id, 1, 0) as isLiked,
        IFNULL(sum(o.amount), 0) as onSale,
        IF ( sum(o.amount) is NULL, NULL, JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', o.id,
            'amount', o.amount, 
            'price', o.price,
            'signature', o.signature,
            'decimals', cur.decimals,
            'currency', cur.symbol, 
            'createdAt', o.createdAt
            ))) as onSalesData
        from Nft n

        JOIN Collection c ON c.id = n.collectionId 

        ${collectionId ? `&& c.id = '${collectionId}'` : ''}

        JOIN IdentityNftBalance b ON b.nftId = n.id ${identityId ? `&&  b.identityId = '${identityId}'` : ''}    

        ${status === 'onSale' ? `JOIN` : `LEFT JOIN`} \`Orders\` o ON o.nftIdentityBalanceId = b.id
        LEFT JOIN Identity  ident ON ident.id = b.identityId
        LEFT JOIN Profile  pr ON pr.id = ident.profileId
        LEFT JOIN BlockchainIdentityAddress addr ON c.identityId = addr.identityId && c.chainId = addr.chainId    
        
        LEFT JOIN (
        SELECT li.nftId, count(li.id) as count 
        FROM NftLike li 
        GROUP BY li.nftId
        ) lik ON lik.nftId = n.id

       LEFT JOIN NftLike ll On ll.nftId = n.id && ll.profileId='${profileId}'


        ${creatorId ? `JOIN` : `LEFT JOIN`} (
          SELECT creator.address, creator.nftId, JSON_ARRAYAGG(
            JSON_OBJECT(
              'address', creator.address,
              'identityId', id.id,
              'accountType', id.accountType,
              'name', pr.name,
              'userName', pr.userName,
              'avatar', pr.avatar
            )
          ) as creatorsData
          FROM IdentityNftCreator creator
          JOIN BlockchainIdentityAddress bad On bad.address = creator.address
          JOIN Identity id On id.id = bad.identityId
          JOIN Profile pr On pr.id = id.profileId
          GROUP BY creator.nftId, creator.address
        ) cr ON cr.nftId = n.id ${creatorId ? `&& JSON_VALUE(cr.creatorsData, '$.identityId') = '${creatorId}'` : ``}

        ${status === 'onLocked' ? `JOIN` : `LEFT JOIN`} (
          SELECT lk.identityNftBalanceId,
                  sum(lk.amount) as lockedBalance, 
          JSON_ARRAYAGG(JSON_OBJECT('id', lk.id, 'amount', lk.amount, 'unlockTime', lk.unlockTime )) as lockedData  
          FROM IdentityNftBalanceLock lk
          GROUP BY lk.identityNftBalanceId
          ) l ON b.id = l.identityNftBalanceId
        LEFT JOIN Currencies cur ON o.currency = cur.symbol



        ${nftId ? `WHERE n.id = '${nftId}'` : ``}
        ${search ? `WHERE JSON_VALUE(n.metadata, '$.name') like '%${search}%'` : ``}
        GROUP BY b.id
        ${sortValue === 'price' ? `ORDER BY  CONVERT(o.price, INTEGER) ${sortType}` : ``}
        ${sortValue === 'unlockTime' ? `ORDER BY l.unlockTime  ${sortType}` : ``}
        )


        SELECT
        tb.nftId as id, 
        p.count as count,
        tb.royalty,
        tb.metadata,
        tb.totalNftAmount,
        tb.thumbnail,
        tb.totalSupply,       
        tb.collection,
        tb.creatorsData,
        tb.likesCount,
        tb.isLiked,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'identityId', tb.identityId,
            'address', tb.address,
            'status', tb.status,
            'accountType', tb.accountType,
            'identityBalance', tb.identityBalance,
            'profile',tb.profile,
            'lockedData', tb.lockedData,
            'lockedBalance', tb.lockedBalance,
            'onSale', tb.onSale,
            'onSalesData', tb.onSalesData 
          )
        ) as owners
        FROM temptable tb
        JOIN (select count(t.nftId) as count from temptable t) p
        GROUP BY tb.nftId
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
        `;

      const [data] = await this.repository.sequelize.query(rawQuery);

      const { total, result } = countHelper(data);
      return {
        data: result,
        pagination: {
          total,
          limit,
          offset,
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
        ['id', 'collectionId', 'thumbnail', 'amount', 'metadata', 'creatorIds', 'royaltyIds', 'royalty', 'totalSupply'],
        nfts.map((nft: INftModel) => [
          `'${nft.id}','${nft.collectionId}','${nft.thumbnail}','${nft.amount}', '${JSON.stringify(
            nft.metadata,
          )}', '${JSON.stringify(nft.creatorIds)}','${JSON.stringify(nft.royaltyIds)}',${nft.royalty}, '${
            nft.totalSupply
          }'`,
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
    viewerUser?: IIdentityModel | null,
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
        listOfAllNewsIdsLikedByUser = await this.getAllNewsLikesListByProfileId(viewerUser.profileId);
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
      historyRecord.dataValues.identity = this.formatIdentityData(historyRecord.dataValues.identity);
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
  async injectLikesToNewsRecord(newsRecord: any, listOfNewsLikesCount: any, listOfAllNewsIdsLikedByUser: any) {
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
      include: [{ model: IdentityModel, as: 'identity', include: [{ model: ProfileModel, as: 'profile' }] }],
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
              totalWorth[balance.nft.collection.blockchain.name].amount += order.toJSON().totalAmount;
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
