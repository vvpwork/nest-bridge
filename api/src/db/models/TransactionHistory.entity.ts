import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsTo,
  DefaultScope,
  AllowNull,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { ITransactionHistory } from '../interfaces';
import { Identity } from '@/db/models/Identity.entity';
import { Nft } from '@/db/models/Nft.entity';
import { TransactionHistoryType } from '@/db/models/TransactionHistoryType.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'TransactionHistory',
  timestamps: true,
})
export class TransactionHistory extends Model<ITransactionHistory> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Identity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  identityId: number;

  @ForeignKey(() => Nft)
  @AllowNull(false)
  @Column(DataType.STRING(60))
  nftId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  price: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  txHash: string;

  @ForeignKey(() => TransactionHistoryType)
  @AllowNull(false)
  @Column(DataType.STRING)
  type: string;

  @BelongsTo(() => Identity, 'identityId')
  identity: Identity;

  @BelongsTo(() => Nft, 'nftId')
  nft: Nft;
}
