/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CollectionModel } from '@/db/models';
import { ICollectionCreateDto } from './dtos/collection-create.dto';
import { ICollectionModel } from '@/db/interfaces';

@Injectable()
export class CollectionService {
  constructor(@InjectModel(CollectionModel) private repository: typeof CollectionModel) {}

  async create(collection: ICollectionModel) {
    return this.repository.create(collection);
  }

  async findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(id?: number) {
    try {
      const rawQuery = `
      select c.id,c.identityId, c.name, c.description, c.logo, c.cover,  
      c.symbol, count(*) as nftCount,
      JSON_ARRAYAGG(
        JSON_OBJECT(
        'id', n.id, 
        'collectionId', n.collectionId,
        'amount', n.amount,
        'thumbnail', n.thumbnail
        ))as nfts
      from Collection c
      INNER JOIN Nft n ON n.collectionId = c.id
      ${id ? `WHERE c.identityId = ${id} ` : ''}
      GROUP BY c.id
      ORDER BY c.createdAt DESC
      limit 10 offset 0
      `;
      const [result]: any = await this.repository.sequelize.query(rawQuery);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
