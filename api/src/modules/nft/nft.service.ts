/* eslint-disable max-len */
import { Get, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NftModel } from '@/db/models';
import { INftQueryDto, SortTypes } from './dtos/nft-query.dto';
import { upsertData } from '@/db/utils/helper';
import { INftModel } from '@/db/interfaces';
import { getShortHash } from '@/common/utils/short-hash.utile';

@Injectable()
export class NftService {
  constructor(@InjectModel(NftModel) private repository: typeof NftModel) {}

  async getAll(search?: INftQueryDto) {
    try {
      const { limit, offset, identityId, collectionId, status, sortType, sortValue, nftId } = search;

      const rawQuery = `
      WITH temptable as (
        SELECT
        b.identityId as identityId,
        n.id as nftId, 
        JSON_OBJECT('id', c.id, 'logo', c.logo, 'cover', c.cover, 'symbol', c.symbol ) as collection,
        n.royalty,
        n.amount  as totalNftAmount,
        n.thumbnail,
        n.totalSupply, 
        n.creatorIds as creators,
        b.amount as identityBalance,
        l.lockedData,
        l.lockedBalance,
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
        
        
        select tb.*, p.count from temptable tb
        JOIN (select count(t.nftId) as count from temptable t) p
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
        `;

      const data = await this.repository.sequelize.query(rawQuery);
      let total = 0;
      const result = data[0].map((r: any) => {
        const { count, ...resultData } = r;
        total = count;
        return resultData;
      });

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
}
