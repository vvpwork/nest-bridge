import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  BelongsTo,
  DefaultScope,
  Default,
} from 'sequelize-typescript';
import { randomBytes } from 'node:crypto';
import { ICollectionModel } from '../interfaces';
import { IdentityModel } from '@/db/models/identity.model';
import { BlockchainModel } from '@/db/models/blockchain.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Collection',
  timestamps: true,
})
export class CollectionModel extends Model<ICollectionModel> {
  @PrimaryKey
  @Column(DataType.STRING)
  id: string;

  @ForeignKey(() => IdentityModel)
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
  symbol: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  logo: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  masterAddress: string;

  @AllowNull(true)
  @Column(DataType.BIGINT)
  salt: number;

  @ForeignKey(() => BlockchainModel)
  @Column(DataType.INTEGER)
  chainId: BlockchainModel;
}
