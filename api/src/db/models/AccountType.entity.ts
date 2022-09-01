import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'AccountType',
  timestamps: false,
})
export class AccountTypeEntity extends Model<{ code: string }> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  code: string;
}
