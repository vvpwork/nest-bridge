/* eslint-disable @typescript-eslint/no-empty-interface */
import { Table, Column, Model, DataType, PrimaryKey, AllowNull, AutoIncrement } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { ICurrenciesModel } from '../interfaces';

export interface ICurrenciesAttributes extends Optional<ICurrenciesModel, 'id'> {}

@Table({
  tableName: 'Currencies',
  timestamps: false,
})
export class CurrenciesModel extends Model<ICurrenciesAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  symbol: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  address: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  decimals: number;
}
