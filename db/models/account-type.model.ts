import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';
import { ACCOUNT_TYPES } from '../enums';

@Table({
  tableName: 'AccountType',
  timestamps: false,
})
export class AccountTypeModel extends Model<{ code: string }> {
  @PrimaryKey
  @Column(DataType.ENUM(ACCOUNT_TYPES.USER, ACCOUNT_TYPES.PARTNER))
  code: ACCOUNT_TYPES;
}
