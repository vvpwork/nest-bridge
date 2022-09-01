import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';
import { INftLikeModel } from '@Common/interfaces';
import { Identity } from '@/db/models/Identity.entity';
import { Nft } from '@/db/models/Nft.entity';

@Table({
  tableName: 'NftLike',
  timestamps: true,
})
export class NftLike extends Model<INftLikeModel> {
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

  @BelongsTo(() => Identity, 'identityId')
  identity: Identity;

  @BelongsTo(() => Nft, 'nftId')
  nft: Nft;
}
