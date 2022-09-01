import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TransactionHistoryType',
  timestamps: false,
})
export class TransactionHistoryTypeEntity extends Model<{ code: string }> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  code: string;
}
