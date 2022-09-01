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
import { IIdentityBalanceModel } from '@Common/interfaces';
import { Identity } from '@/db/models/Identity.entity';
import { Nft } from '@/db/models/Nft.entity';
import { IdentityNftBalanceStatus } from '@/db/models/IdentityNftBalanceStatus.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'IdentityNftBalance',
  timestamps: true,
})
export class IdentityNftBalance extends Model<IIdentityBalanceModel> {
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

  @ForeignKey(() => IdentityNftBalanceStatus)
  @AllowNull(false)
  @Column(DataType.STRING)
  status: string;

  @BelongsTo(() => Identity, 'identityId')
  identity: Identity;

  @BelongsTo(() => Nft, 'nftId')
  nft: Nft;
}
