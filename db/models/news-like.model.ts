import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { INewsLikeModel } from '../interfaces';
import { ProfileModel } from './profile.model';
import { NewsModel } from './news.model';

@Table({
  tableName: 'NewsLike',
  timestamps: true,
})
export class NewsLikeModel extends Model<INewsLikeModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: ProfileModel;

  @ForeignKey(() => NewsModel)
  @Column(DataType.UUIDV4)
  newsId: NewsModel;
}
