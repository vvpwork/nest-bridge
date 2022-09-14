/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { IBlockchainIdentityAddress } from '../interfaces';
import { BlockchainModel } from './blockchain.model';
import { IdentityModel } from './identity.model';

interface IIdentityBlockchainAddressAttributes extends Optional<IBlockchainIdentityAddress, 'id'> {}

@Table({
  tableName: 'BlockchainIdentityAddress',
  timestamps: false,
})
export class BlockchainIdentityAddressModel extends Model<IIdentityBlockchainAddressAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => BlockchainModel)
  @Column(DataType.BIGINT)
  chainId: BlockchainModel;

  @ForeignKey(() => IdentityModel)
  @Column(DataType.UUID)
  identityId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  address: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  description: string;

  @BelongsTo(() => IdentityModel, 'identityId')
  identity: IdentityModel;
}
