import { Get, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NftModel } from '@/db/models';
import { Public } from '@/common/decorators';
import { INftQueryDto } from './dtos/nft-query.dto';

@Injectable()
export class NftService {
  constructor(@InjectModel(NftModel) private repository: typeof NftModel) {}

  async getAll(search?: INftQueryDto) {
    try {
      const { limit, offset, identityId, collectionId, status } = search || { limit: 50, offset: 0 };

      const rawQuery = `
        SELECT
        b.identityId as identityId,
        n.id as nftId, 
        JSON_OBJECT('id', c.id, 'logo', c.logo, 'cover', c.cover, 'symbol', c.symbol ) as collection,
        n.royalty,
        n.amount  as totalNftAmount,
        n.thumbnail,
        n.totalSupply, 
        b.amount as identityBalance,
        IFNULL(sum(l.amount), 0) as lockedBalance,
        IF ( sum(l.amount) is NULL, NULL, JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', l.id,
            'amount', l.amount, 
            'unlockTime', l.unlockTime
            ))) as lockedData,
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

        JOIN IdentityNftBalance b ON b.nftId = n.id ${identityId ? `&&  b.identityId = ${identityId}` : ''}    
        ${status === 'onSale' ? `JOIN` : `LEFT JOIN`} \`Orders\` o ON o.nftIdentityBalanceId = b.id
        ${status === 'onLocked' ? `JOIN` : `LEFT JOIN`} IdentityNftBalanceLock l ON b.id = l.identityNftBalanceId
        LEFT JOIN Currencies cur ON o.currencyId = cur.id
        GROUP BY b.id
        ORDER BY  CONVERT(o.price, INTEGER) DESC
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
        `;

      const [result] = await this.repository.sequelize.query(rawQuery);

      return result;
    } catch (e) {
      Logger.error('Error nft service', e);
      throw e;
    }
  }
}
