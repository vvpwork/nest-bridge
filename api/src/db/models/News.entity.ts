import { Table, Column, Model, DataType, PrimaryKey, DefaultScope, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { randomBytes } from 'node:crypto';
import { INewsModel } from '@Common/interfaces';
import { ProfileEntity } from '@/db/models/Profile.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'News',
  timestamps: true,
})
export class NewsEntity extends Model<INewsModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(randomBytes(20).toString('hex').slice(0, 60))
  @Column(DataType.STRING(60))
  id: string;

  @ForeignKey(() => ProfileEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  image: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  source: string;

  @BelongsTo(() => ProfileEntity, 'profileId')
  profile: ProfileEntity;
}
