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
import { IdentityEntity } from '@/db/models/Identity.entity';
import { NftEntity } from '@/db/models/Nft.entity';
import { IdentityNftBalanceStatusEntity } from '@/db/models/IdentityNftBalanceStatus.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'IdentityNftBalance',
  timestamps: true,
})
export class IdentityNftBalanceEntity extends Model<IIdentityBalanceModel> {
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

  @ForeignKey(() => IdentityNftBalanceStatusEntity)
  @AllowNull(false)
  @Column(DataType.STRING)
  status: string;

  @BelongsTo(() => IdentityEntity, 'identityId')
  identity: IdentityEntity;

  @BelongsTo(() => NftEntity, 'nftId')
  nft: NftEntity;
}
