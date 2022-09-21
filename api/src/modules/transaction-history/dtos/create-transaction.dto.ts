import { IsEnum, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionDataDto } from '@Modules/transaction-history/dtos/';
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
  @IsNumber()
  public amount!: number;

  @IsString()
  @Length(1, 128)
  public txHash!: string;

  @Type(() => TransactionDataDto)
  @IsOptional()
  @ValidateNested()
  public data?: TransactionDataDto;

  @IsEnum(TransactionsType)
  type!: TransactionsType;
}
