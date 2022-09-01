import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';
import { INftLikeModel } from '@Common/interfaces';
import { IdentityEntity } from '@/db/models/Identity.entity';
import { NftEntity } from '@/db/models/Nft.entity';

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

  @ForeignKey(() => IdentityEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  identityId: number;

  @ForeignKey(() => NftEntity)
  @AllowNull(false)
  @Column(DataType.STRING(60))
  nftId: string;

  @BelongsTo(() => IdentityEntity, 'identityId')
  identity: IdentityEntity;

  @BelongsTo(() => NftEntity, 'nftId')
  nft: NftEntity;
}
