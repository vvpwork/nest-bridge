import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  DefaultScope,
  AllowNull,
  Unique,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { INftModel } from '../interfaces';
import { CollectionModel } from '@/db/models/collection.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Nft',
  timestamps: true,
})
export class NftModel extends Model<INftModel> {
  @PrimaryKey
  @Column(DataType.STRING)
  id: string;

  @ForeignKey(() => CollectionModel)
  @Column(DataType.STRING)
  collectionId: CollectionModel;

  @AllowNull(true)
  @Column(DataType.STRING)
  thumbnail: string;

  @AllowNull(true)
  @Column(DataType.JSON)
  metadata: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER, comment: 'The tokens amount that actually were minted' })
  amount: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, comment: 'The maximum tokens amount that can be ever minted' })
  totalSupply: number;

  @AllowNull(false)
  @Column(DataType.JSON)
  creatorIds: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  royaltyIds: string;

  @Column(DataType.BIGINT)
  royalty: number;

  @BelongsTo(() => CollectionModel, 'collectionId')
  collection: CollectionModel;
}
