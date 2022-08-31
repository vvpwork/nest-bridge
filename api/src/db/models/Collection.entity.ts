import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  DefaultScope,
} from 'sequelize-typescript';

import { ICollectionModel } from '@Common/interfaces';
import { Blockchain, Identity } from '@/db/models/index';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Collection',
  timestamps: true,
})
export class Collection extends Model<ICollectionModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Identity, 'identityId')
  identity: Identity;

  @BelongsTo(() => Blockchain, 'chainId')
  blockchain: Blockchain;
}
