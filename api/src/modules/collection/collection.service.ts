/* eslint-disable no-useless-catch */
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiTags } from '@nestjs/swagger';
import { CollectionModel, NftModel } from '@/db/models';
import { ICollectionModel } from '@/db/interfaces';
import { ICollectionCreateDto } from './dtos/collection-create.dto';
import { ICollectionQueryDto } from './dtos';
import { NftModule } from '../nft';

@ApiTags('Collection')
@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(CollectionModel) private repository: typeof CollectionModel,
    @InjectModel(NftModel) private nftModel: typeof NftModel,
  ) {}

  async create(collection: ICollectionModel) {
    try {
      return this.repository.create(collection);
    } catch (err) {
      Logger.error('Controller service', err);
      throw new HttpException('Error save to db', 502);
    }
  }

  async findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(query: ICollectionQueryDto) {
    const offset = query.offset === 0 ? 0 : query.limit * query.offset - query.limit;

    const { identityId, collectionId, withNft } = query;

    const where: Partial<ICollectionModel> = {};

    if (identityId) {
      where.identityId = identityId;
    }

    if (collectionId) {
      where.id = collectionId;
    }

    const result = await this.repository.findAndCountAll({
      limit: query.limit,
      offset,
      where,
      include: withNft && [
        {
          model: NftModel,
          attributes: ['id', 'royalty', 'amount', 'thumbnail', 'creatorIds'],
        },
      ],
    });

    return {
      data: result.rows.map((d: CollectionModel) => d.toJSON()),
      pagination: {
        offset: query.offset,
        limit: result.rows.length,
        total: result.count,
      },
    };
  }
}
