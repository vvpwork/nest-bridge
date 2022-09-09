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
  Default,
} from 'sequelize-typescript';
import { IOrderModel } from '../interfaces';
import { IdentityModel } from '@/db/models/identity.model';
import { NftModel } from '@/db/models/nft.model';
import { CurrenciesModel } from './currencies.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Orders',
  timestamps: true,
})
export class Order extends Model<IOrderModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => IdentityModel)
  @Column(DataType.BIGINT)
  identityId: number;

  @ForeignKey(() => NftModel)
  @Column(DataType.STRING)
  nftId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  price: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  signature: string;

  @AllowNull(true)
  @ForeignKey(() => CurrenciesModel)
  @Column(DataType.BIGINT)
  currencyId: number;
}
