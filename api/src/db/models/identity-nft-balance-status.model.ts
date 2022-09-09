import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'IdentityNftBalanceStatus',
  timestamps: false,
})
export class IdentityNftBalanceStatusModel extends Model<{ code: string }> {
  @PrimaryKey
  @Column(DataType.STRING)
  code: string;
}
