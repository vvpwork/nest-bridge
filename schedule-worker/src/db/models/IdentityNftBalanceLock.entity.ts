import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
} from 'sequelize-typescript';
import { IIdentityNftBalanceLock } from './interfaces';

@Table({
  tableName: 'IdentityNftBalanceStatus',
  timestamps: true,
})
export class IdentityNftBalanceLock extends Model<IIdentityNftBalanceLock> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  identityNftBalanceId: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  unlockTime: number;
}
