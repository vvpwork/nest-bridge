import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  DefaultScope,
  BelongsTo,
  AutoIncrement,
} from 'sequelize-typescript';
import { IOrderModel } from '@Common/interfaces';
import { Identity } from '@/db/models/Identity.entity';
import { Nft } from '@/db/models/Nft.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Order',
  timestamps: true,
})
export class Order extends Model<IOrderModel> {
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
  @Column(DataType.UUIDV4)
  nftId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  price: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  signature: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  decimals: number;

  @BelongsTo(() => Identity, 'identityId')
  identity: Identity;

  @BelongsTo(() => Nft, 'nftId')
  nft: Nft;
}
