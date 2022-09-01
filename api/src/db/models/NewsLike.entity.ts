import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';
import { INewsLikeModel } from '@Common/interfaces';
import { ProfileEntity } from '@/db/models/Profile.entity';
import { NewsEntity } from '@/db/models/News.entity';

@Table({
  tableName: 'NewsLike',
  timestamps: true,
})
export class NewsLikeEntity extends Model<INewsLikeModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @ForeignKey(() => NewsEntity)
  @AllowNull(false)
  @Column(DataType.STRING(60))
  newsId: string;

  @BelongsTo(() => ProfileEntity, 'profileId')
  profile: ProfileEntity;

  @BelongsTo(() => NewsEntity, 'newsId')
  news: NewsEntity;
}
