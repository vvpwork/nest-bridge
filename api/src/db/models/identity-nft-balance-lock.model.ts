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
import { IIdentityNftBalanceLock } from '../interfaces';
import { IdentityNftBalanceModel } from '@/db/models/identity-nft-balance.model';

@Table({
  tableName: 'IdentityNftBalanceStatus',
  timestamps: false,
})
export class IdentityNftBalanceLock extends Model<IIdentityNftBalanceLock> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => IdentityNftBalanceModel)
  @Column(DataType.BIGINT)
  identityNftBalanceId: IdentityNftBalanceModel;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  unlockTime: number;
}
