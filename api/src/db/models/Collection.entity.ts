import { Table, Column, Model, DataType, PrimaryKey, AllowNull, ForeignKey, BelongsTo, DefaultScope, Default } from 'sequelize-typescript';
import { ICollectionModel } from '@Common/interfaces';
import { randomBytes } from 'node:crypto';
import { IdentityEntity } from '@/db/models/Identity.entity';
import { BlockchainEntity } from '@/db/models/Blockchain.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Collection',
  timestamps: true,
})
export class CollectionEntity extends Model<ICollectionModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(randomBytes(20).toString('hex').slice(0, 60))
  @Column(DataType.STRING(60))
  id: string;

  @ForeignKey(() => IdentityEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  identityId: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  description: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  cover: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  logo: string;

  @ForeignKey(() => BlockchainEntity)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  chainId: number;

  @BelongsTo(() => IdentityEntity, 'identityId')
  identity: IdentityEntity;

  @BelongsTo(() => BlockchainEntity, 'chainId')
  blockchain: BlockchainEntity;
}
