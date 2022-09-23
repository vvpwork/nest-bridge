/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-empty-interface */
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
  Default,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { IIdentityBalanceModel } from '../interfaces';
import { IdentityModel } from '@/db/models/identity.model';
import { NftModel } from '@/db/models/nft.model';
import { IdentityNftBalanceStatusModel } from '@/db/models/identity-nft-balance-status.model';
import { IdentityNftBalanceLock } from './identity-nft-balance-lock.model';
import { OrdersModel } from './order.model';

interface IIdentityAttributes extends Optional<IIdentityBalanceModel, 'id'> {}

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'IdentityNftBalance',
  timestamps: true,
})
export class IdentityNftBalanceModel extends Model<IIdentityAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => IdentityModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  identityId: number;

  @ForeignKey(() => NftModel)
  @Column(DataType.STRING)
  nftId: NftModel;

  @Default(0)
  @Column(DataType.INTEGER)
  amount: number;

  @ForeignKey(() => IdentityNftBalanceStatusModel)
  @AllowNull(true)
  @Column(DataType.STRING)
  status: IdentityNftBalanceStatusModel;

  @HasMany(() => IdentityNftBalanceLock)
  locked: IdentityNftBalanceLock[];

  @BelongsTo(() => NftModel, 'nftId')
  nft: NftModel;

  @BelongsTo(() => IdentityModel, 'identityId')
  identity: IdentityModel;

  @HasMany(() => OrdersModel, 'nftIdentityBalanceId')
  orders: OrdersModel[];
}
