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
import { ILibraryModel } from '../interfaces';
import { ProfileModel } from '@/db/models/profile.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Library',
  timestamps: true,
})
export class LibraryModel extends Model<ILibraryModel> {
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
  @Column(DataType.STRING)
  image: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  source: string;
}
