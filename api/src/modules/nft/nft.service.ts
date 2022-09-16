/* eslint-disable max-len */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { paginate } from '@Common/utils/pagination.util';
import { ACCOUNT_TYPES } from '@DB/enums';
import {
  BlockchainIdentityAddressModel,
  IdentityModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NftLikeModel,
  NftModel,
  PodcastModel,
  ProfileModel,
  TransactionHistoryModel,
} from '@/db/models';
import { INftQueryDto } from './dtos/nft-query.dto';
import { upsertData } from '@/db/utils/helper';
import { IIdentityModel, INftModel } from '@/db/interfaces';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { config } from '@/common/config';
import { countHelper } from '@/common/utils';

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
  ) {}

  async getAll(search?: INftQueryDto) {
    try {
      const { limit, offset, identityId, collectionId, status, sortType, sortValue, nftId } = search;

      // One select for all nft requirements
      const rawQuery = `
      WITH temptable as (
        SELECT
        b.identityId as identityId,
        JSON_OBJECT('id', pr.id, 'cover', pr.cover, 'avatar', pr.avatar, 'name', pr.name ) as profile,
        n.id as nftId, 
        JSON_OBJECT('id', c.id, 'logo', c.logo, 'cover', c.cover, 'symbol', c.symbol ) as collection,
        n.royalty,
        n.amount  as totalNftAmount,
        n.thumbnail,
        addr.address  as address,
        n.totalSupply, 
        n.creatorIds as creators,
        b.amount as identityBalance,
        l.lockedData,
        l.lockedBalance,
        IF(pr.id = lk.profileId, 1, 0) as isLiked,
        count(lk.id) as likesCount,
        IFNULL(sum(o.amount), 0) as onSale,
        IF ( sum(o.amount) is NULL, NULL, JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', o.id,
            'amount', o.amount, 
            'price', o.price,
            'signature', o.signature,
            'decimals', cur.decimals,
            'currency', cur.symbol 
            ))) as onSalesData
        from Nft n
        JOIN Collection c ON c.id = n.collectionId 
        ${collectionId ? `&& c.id = '${collectionId}'` : ''}
        JOIN IdentityNftBalance b ON b.nftId = n.id ${identityId ? `&&  b.identityId = '${identityId}'` : ''}    
        ${status === 'onSale' ? `JOIN` : `LEFT JOIN`} \`Orders\` o ON o.nftIdentityBalanceId = b.id
        LEFT JOIN Identity  ident ON ident.id = b.identityId
        LEFT JOIN Profile  pr ON pr.id = ident.profileId
        LEFT JOIN BlockchainIdentityAddress addr ON c.identityId = addr.identityId && c.chainId = addr.chainId    
        LEFT JOIN NftLike lk ON lk.nftId = n.id
        ${status === 'onLocked' ? `JOIN` : `LEFT JOIN`} (
          SELECT lk.identityNftBalanceId,
                  sum(lk.amount) as lockedBalance, 
          JSON_ARRAYAGG(JSON_OBJECT( 'amount', lk.amount, 'unlockTime', lk.unlockTime )) as lockedData  
          FROM IdentityNftBalanceLock lk
          GROUP BY lk.identityNftBalanceId
          ) l ON b.id = l.identityNftBalanceId
        LEFT JOIN Currencies cur ON o.currency = cur.symbol
        ${nftId ? `WHERE n.id = '${nftId}'` : ``}
        GROUP BY b.id
        ${sortValue === 'price' ? `ORDER BY  CONVERT(o.price, INTEGER) ${sortType}` : ``}
        ${sortValue === 'created' ? `ORDER BY  o.createdAt  ${sortType}` : ``}
        ${sortValue === 'unlockTime' ? `ORDER BY l.unlockTime  ${sortType}` : ``}
        )

       

        SELECT
        tb.nftId as id, 
        p.count as count,
        tb.royalty,
        tb.totalNftAmount,
        tb.thumbnail,
        tb.totalSupply, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', creators.id
          )
        ) as creators,        
        tb.collection,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'identityId', tb.identityId,
            'address', tb.address,
            'identityBalance', tb.identityBalance,
            'profile',tb.profile,
            'lockedData', tb.lockedData,
            'lockedBalance', tb.lockedBalance,
            'isLiked', tb.isLiked,
            'likesCount', tb.likesCount,
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

    const balancesQuery = upsertData(
      'IdentityNftBalance',
      ['id', 'identityId', 'nftId', 'amount'],
      nfts.map((nft: INftModel) => [
        `'${getShortHash(identityId, nft.id)}','${identityId}','${nft.id}','${nft.amount}'`,
      ]),
    );

    await this.repository.sequelize.query(balancesQuery);
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
      result = await Promise.all(
        result.data.map(async (news: NewsModel) => this.injectLikesToNewsRecord(news, viewerUser)),
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
  async injectLikesToNewsRecord(newsRecord: NewsModel, viewerUser?: IIdentityModel) {
    const result = newsRecord;
    result.isLiked = false;

    result.likesCount = await this.getLikesCount(newsRecord.id);

    if (viewerUser) {
      result.isLiked = await this.isNewsLiked(newsRecord.id, +viewerUser.profileId);
    }

    return result;
  }

  async getLikesCount(newsId: string): Promise<number> {
    return this.newsLikeModel.count({
      where: { newsId },
    });
  }

  async isNewsLiked(newsId: string, profileId: number): Promise<boolean> {
    const newsLikeRecord = await this.newsLikeModel.findOne({
      where: { newsId, profileId },
      attributes: ['id'],
      raw: true,
    });
    return !!newsLikeRecord;
  }

  async getArtemundiIdentity() {
    const artemundiWalletRecord = await this.blockchainIdentityAddressModel.findOne({
      where: { address: config.blockChain.artemundiWallet },
      include: [{ model: IdentityModel, as: 'identity', include: [{ model: ProfileModel, as: 'profile' }] }],
    });

    return artemundiWalletRecord.identity;
  }
}
