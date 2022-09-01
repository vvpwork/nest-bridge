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
import { randomBytes } from 'node:crypto';
import { INftModel } from '@Common/interfaces';
import { CollectionEntity } from '@/db/models/Collection.entity';
import { IdentityNftBalanceEntity } from '@/db/models/IdentityNftBalance.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Nft',
  timestamps: true,
})
export class NftEntity extends Model<INftModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(randomBytes(20).toString('hex').slice(0, 60))
  @Column(DataType.STRING(60))
  id: string;

  @ForeignKey(() => CollectionEntity)
  @AllowNull(false)
  @Column(DataType.STRING(60))
  collectionId: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  tokenId: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  thumbnail: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  metadata: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER, comment: 'The tokens amount that actually were minted' })
  amount: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, comment: 'The maximum tokens amount that can be ever minted' })
  totalSupply: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  creatorIds: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  royaltyIds: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  royalty: number;

  @HasMany(() => IdentityNftBalanceEntity, 'nftId')
  owners: IdentityNftBalanceEntity;

  @BelongsTo(() => CollectionEntity, 'collectionId')
  collection: CollectionEntity;
}
