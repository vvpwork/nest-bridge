import { Table, Column, Model, DataType, PrimaryKey, AllowNull, ForeignKey, BelongsTo, DefaultScope, Default } from 'sequelize-typescript';
import { ICollectionModel } from '@Common/interfaces';
import { randomBytes } from 'node:crypto';
import { Identity } from '@/db/models/Identity.entity';
import { Blockchain } from '@/db/models/Blockchain.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Collection',
  timestamps: true,
})
export class Collection extends Model<ICollectionModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(randomBytes(20).toString('hex').slice(0, 60))
  @Column(DataType.STRING(60))
  id: string;

  @ForeignKey(() => Identity)
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

  @ForeignKey(() => Blockchain)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  chainId: number;

  @BelongsTo(() => Identity, 'identityId')
  identity: Identity;

  @BelongsTo(() => Blockchain, 'chainId')
  blockchain: Blockchain;
}
