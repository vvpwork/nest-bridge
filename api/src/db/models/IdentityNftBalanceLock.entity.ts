import { Table, Column, Model, DataType, PrimaryKey, AllowNull, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { IIdentityNftBalanceLock } from '@Common/interfaces';
import { IdentityNftBalance } from '@/db/models/IdentityNftBalance.entity';

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

  @ForeignKey(() => IdentityNftBalance)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  identityNftBalanceId: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  unlockTime: number;

  @BelongsTo(() => IdentityNftBalance, 'identityNftBalanceId')
  nftBalance: IdentityNftBalance;
}
