import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  DefaultScope,
  AllowNull,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';

import { BlockchainIdentityAddressModel } from '@DB/models/blockchain-identity-address.model';
import { ITransactionHistory } from '../interfaces';
import { IdentityModel } from '@/db/models/identity.model';
import { NftModel } from '@/db/models/nft.model';
import { TransactionHistoryTypeModel } from '@/db/models/transaction-history-type.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'TransactionHistory',
  timestamps: true,
})
export class TransactionHistoryModel extends Model<ITransactionHistory> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => IdentityModel)
  @Column(DataType.BIGINT)
  identityId: IdentityModel;

  @ForeignKey(() => NftModel)
  @Column(DataType.STRING)
  nftId: string;

  @Column(DataType.STRING)
  address: string;

  @AllowNull(true)
  @Column(DataType.NUMBER)
  amount: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  price: string;

  @ForeignKey(() => BlockchainIdentityAddressModel)
  @AllowNull(true)
  @Column(DataType.STRING)
  address: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  txHash: string;

  @Column(DataType.JSON)
  data: string;

  @ForeignKey(() => TransactionHistoryTypeModel)
  @Column(DataType.STRING)
  type: TransactionHistoryTypeModel;

  @BelongsTo(() => IdentityModel, 'identityId')
  identity: IdentityModel;

  @BelongsTo(() => NftModel, 'nftId')
  nft: NftModel;

  @BelongsTo(() => BlockchainIdentityAddressModel, { foreignKey: 'address', targetKey: 'address' })
  addresses: BlockchainIdentityAddressModel;
}
