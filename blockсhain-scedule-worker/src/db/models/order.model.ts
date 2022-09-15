/* eslint-disable import/no-cycle */
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  DefaultScope,
  Default,
} from 'sequelize-typescript';
import { IOrderModel } from '../interfaces';

import { CurrenciesModel } from './currencies.model';
import { IdentityNftBalanceModel } from './identity-nft-balance.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Orders',
  timestamps: true,
})
export class OrdersModel extends Model<IOrderModel> {
  [x: string]: any;
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => IdentityNftBalanceModel)
  @Column(DataType.UUID)
  nftIdentityBalanceId: IdentityNftBalanceModel;

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
  @Column(DataType.JSON)
  metadata: string;

  @ForeignKey(() => CurrenciesModel)
  @Column(DataType.STRING)
  currency: CurrenciesModel;
}
