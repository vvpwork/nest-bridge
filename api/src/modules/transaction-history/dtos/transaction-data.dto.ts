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

  @IsBoolean()
  @IsOptional()
  public isClaimed?: boolean;
}
