import { Optional } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class TransactionDataDto {
  @IsNumber()
  @IsOptional()
  public poolId?: number;

  @IsNumber()
  @IsOptional()
  public stakingPeriodEnd?: number;

  @IsNumber()
  @IsOptional()
  public apr?: number;
}

export class IAddTransactionsStakingData {
  @IsNumber()
  poolId: number;

  @IsNumber()
  stakingPeriodEnd: number;

  @IsNumber()
  apr: number;

  @IsString()
  amount: string;

  @IsNumber()
  chainId: number;

  @IsString()
  currency: string;

  @IsNumber()
  decimal: number;

  @IsString()
  serviceFee: string;
}

export class IAdditionalInfo {
  @Optional()
  @IsString()
  ethBalance: string;

  @Optional()
  @IsString()
  usdcBalance: string;

  @Optional()
  @IsString()
  avaxBalance: string;
}
