import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'NotificationType',
  timestamps: false,
})
export class NotificationType extends Model<{ code: string }> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  code: string;
}
