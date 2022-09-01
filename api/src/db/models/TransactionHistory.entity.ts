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
import { ITransactionHistory } from '@Common/interfaces';
import { IdentityEntity } from '@/db/models/Identity.entity';
import { NftEntity } from '@/db/models/Nft.entity';
import { TransactionHistoryTypeEntity } from '@/db/models/TransactionHistoryType.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'TransactionHistory',
  timestamps: true,
})
export class TransactionHistoryEntity extends Model<ITransactionHistory> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => IdentityEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  identityId: number;

  @ForeignKey(() => NftEntity)
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

  @ForeignKey(() => TransactionHistoryTypeEntity)
  @AllowNull(false)
  @Column(DataType.STRING)
  type: string;

  @BelongsTo(() => IdentityEntity, 'identityId')
  identity: IdentityEntity;

  @BelongsTo(() => NftEntity, 'nftId')
  nft: NftEntity;
}
