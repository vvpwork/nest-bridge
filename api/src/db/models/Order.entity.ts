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
import { IdentityEntity } from '@/db/models/Identity.entity';
import { NftEntity } from '@/db/models/Nft.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Order',
  timestamps: true,
})
export class OrderEntity extends Model<IOrderModel> {
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
  @Column(DataType.STRING(128))
  price: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  signature: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  decimals: number;

  @BelongsTo(() => IdentityEntity, 'identityId')
  identity: IdentityEntity;

  @BelongsTo(() => NftEntity, 'nftId')
  nft: NftEntity;
}
