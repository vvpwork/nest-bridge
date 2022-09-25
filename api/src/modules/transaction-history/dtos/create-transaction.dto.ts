import { IsEnum, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IAdditionalInfo, IAddTransactionsStakingData } from './transaction-data.dto';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */

export enum TransactionsType {
  stake = 'STAKE',
  claim = 'CLAIM',
  buyDigitalSecurity = 'BUY_DIGITAL_SECURITY',
}

export class CreateTransactionDto {
  @IsString()
  public txHash!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IAddTransactionsStakingData)
  public data?: IAddTransactionsStakingData;

  @IsOptional()
  @ValidateNested()
  @Type(() => IAdditionalInfo)
  public additionalInfo?: IAdditionalInfo;

  @IsEnum(TransactionsType)
  type!: TransactionsType;
}
