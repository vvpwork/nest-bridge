/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiTags } from '@nestjs/swagger';
import {
  BlockchainIdentityAddressModel,
  CollectionModel,
  IdentityModel,
  NftModel,
  ProfileModel,
} from '@DB/models';
import { ICollectionModel } from '@DB/interfaces';
import { ICollectionQueryDto } from './dtos';
import { BlockchainService } from '../blockchain/blockchain.service';
import { NftService } from '../nft/nft.service';
import { countHelper } from '@/common/utils';
import { getAllCollectionSelect } from './selects';

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
      return newCollection;
    } catch (err) {
      Logger.error('Controller service', err);
      throw new HttpException('Error save to db', 502);
    }
  }

  async findOne(id: string) {
    return this.repository.findOne({
      where: { id },
      include: {
        model: IdentityModel,
        attributes: ['id', 'status', 'accountType'],
        include: [
          {
            model: ProfileModel,
            as: 'profile',
            attributes: ['avatar', 'cover', 'userName'],
          },
          {
            model: BlockchainIdentityAddressModel,
            attributes: ['address'],
            as: 'address',
          },
        ],
      },
    });
  }

  async findAll(query: ICollectionQueryDto) {
    const offset = query.offset === 0 ? 0 : query.limit * query.offset - query.limit;
    const [data] = await this.repository.sequelize.query(
      getAllCollectionSelect({ ...query, offset }),
    );
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

  async update(collectionId: string, identityId: string, data: Partial<ICollectionModel>) {
    const collection = await this.repository.findOne({
      where: {
        id: collectionId,
        identityId,
      },
    });

    if (!collection) throw new HttpException('Collection for this user was not found', 404);

    await this.repository.update(data, {
      where: {
        id: collectionId,
        identityId,
      },
      returning: true,
    });
    return {
      data: { ...collection.toJSON(), ...data },
    };
  }
}
