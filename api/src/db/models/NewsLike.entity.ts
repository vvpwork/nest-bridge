import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, AutoIncrement, BelongsTo, AllowNull } from 'sequelize-typescript';
import { INewsLikeModel } from '../interfaces';
import { Profile } from '@/db/models/Profile.entity';
import { News } from '@/db/models/News.entity';

@Table({
  tableName: 'NewsLike',
  timestamps: true,
})
export class NewsLike extends Model<INewsLikeModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @ForeignKey(() => News)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  newsId: string;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;

  @BelongsTo(() => News, 'newsId')
  news: News;
}
