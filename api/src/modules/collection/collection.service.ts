/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiTags } from '@nestjs/swagger';
import { CollectionModel, IdentityModel, NftModel, ProfileModel } from '@/db/models';
import { ICollectionModel } from '@/db/interfaces';
import { ICollectionQueryDto } from './dtos';
import { BlockchainService } from '../blockchain/blockchain.service';
import { NftService } from '../nft/nft.service';
import { countHelper } from '@/common/utils';

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

  async findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(query: ICollectionQueryDto) {
    const offset = query.offset === 0 ? 0 : query.limit * query.offset - query.limit;

    const searchQuery = `
    with temptable as (
    SELECT c.* , JSON_OBJECT(
      'id',  d.id,
      'name', d.name,
      'userName', d.userName,
      'address', d.address,
      'email', d.email,
      'status', d.status,
      'accountType', d.accountType,
      'cover', d.cover,
      'avatar', d.avatar
      ) as identity FROM Collection c
    LEFT JOIN (
      SELECT i.*, b.address, b.chainId, p.name, p.cover, p.avatar, p.email, p.userName FROM Identity i
      LEFT JOIN BlockchainIdentityAddress b ON  b.identityId = i.id
      LEFT JOIN Profile p ON  p.id = i.profileId
      GROUP BY i.id
    ) d ON c.identityId = d.id && c.chainId = d.chainId
    ${query.search ? `WHERE c.name LIKE '%${query.search}%'` : ''}
    GROUP BY c.id)

    SELECT tb.*, p.count  FROM temptable tb 
    JOIN (select count(t.id) as count from temptable t) p  
    ${query.limit ? `LIMIT ${query.limit}` : ''}
    ${offset ? `OFFSET ${offset}` : ''}
    `;

    const [data] = await this.repository.sequelize.query(searchQuery);
    const { total, result } = countHelper(data);

    return {
      data: result,
      pagination: {
        total,
        limit: query.limit,
        offset,
      },
    };
  }
}
