import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Default,
  AutoIncrement,
  HasOne,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

import { IProfileModel } from '@Common/interfaces';
import { PROFILE_SECTIONS } from '@Common/enums';
import { Identity } from '@/db/models/index';

@Table({
  tableName: 'Profile',
  timestamps: true,
})
export class Profile extends Model<IProfileModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  cover: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  avatar: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  userName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  website: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  communityLink: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  bio: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  socials: string;

  @Default(Object.values(PROFILE_SECTIONS))
  @Column(DataType.JSONB)
  sections: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasOne(() => Identity, 'profileId')
  identity: Identity;
}
