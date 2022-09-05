import { Table, Column, Model, DataType, PrimaryKey, DefaultScope, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { randomBytes } from 'node:crypto';
import { ILibraryModel } from '../interfaces';
import { Profile } from '@/db/models/Profile.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Library',
  timestamps: true,
})
export class Library extends Model<ILibraryModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(randomBytes(20).toString('hex').slice(0, 60))
  @Column(DataType.STRING(60))
  id: string;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  image: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  source: string;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;
}
