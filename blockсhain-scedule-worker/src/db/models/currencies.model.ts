/* eslint-disable @typescript-eslint/no-empty-interface */
import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { ICurrenciesModel } from '../interfaces';

@Table({
  tableName: 'Currencies',
  timestamps: false,
})
export class CurrenciesModel extends Model<ICurrenciesModel> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  symbol: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  address: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  decimals: number;
}
