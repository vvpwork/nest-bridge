import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  DefaultScope,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { randomBytes } from 'node:crypto';
import { INewsModel } from '../interfaces';
import { ProfileModel } from './profile.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'News',
  timestamps: true,
})
export class NewsModel extends Model<INewsModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: ProfileModel;

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

  @AllowNull(true)
  @Column(DataType.VIRTUAL)
  likesCount: number;

  @AllowNull(true)
  @Column(DataType.VIRTUAL)
  isLiked: boolean;
}
