import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TransactionHistoryType',
  timestamps: false,
})
export class TransactionHistoryTypeModel extends Model<{ code: string }> {
  @PrimaryKey
  @Column(DataType.STRING)
  code: string;
}
