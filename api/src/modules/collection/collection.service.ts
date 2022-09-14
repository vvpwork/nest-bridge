/* eslint-disable no-useless-catch */
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiTags } from '@nestjs/swagger';
import { CollectionModel, NftModel } from '@/db/models';
import { ICollectionModel } from '@/db/interfaces';
import { ICollectionQueryDto } from './dtos';
import { BlockchainService } from '../blockchain/blockchain.service';
import { NftService } from '../nft/nft.service';

@ApiTags('Collection')
@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(CollectionModel) private repository: typeof CollectionModel,
    @InjectModel(NftModel) private nftModel: typeof NftModel,
    private bcService: BlockchainService,
    private nftService: NftService,
  ) {}

  async create(collection: ICollectionModel) {
    try {
      const newCollection = await this.repository.create(collection);
      const nfts = await this.bcService.getPastCollectionNfts(newCollection.id);
      await this.nftService.fillNftsByCollection(nfts, collection.identityId);
      return newCollection;
    } catch (err) {
      Logger.error('Controller service', err);
      throw new HttpException('Error save to db', 502);
    }
  }

  // async fillCollectionByNfts(collectionAddress: string) {}

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
