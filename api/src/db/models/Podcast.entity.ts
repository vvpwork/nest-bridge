import { Table, Column, Model, DataType, PrimaryKey, DefaultScope, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { randomBytes } from 'node:crypto';
import { IPodcastModel } from '@Common/interfaces';
import { Profile } from '@/db/models/Profile.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Podcast',
  timestamps: true,
})
// const test = function (): string {
//   return generateRandomString(60);
// };
export class Podcast extends Model<IPodcastModel> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(60))
  // set id(value: string) {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   this.setDataValue('id', 'sad');
  // }
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
  description: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  image: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  source: string;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;
}
