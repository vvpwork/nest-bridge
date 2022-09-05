import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'IdentityNftBalanceStatus',
  timestamps: false,
})
export class IdentityNftBalanceStatus extends Model<{ code: string }> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  code: string;
}
