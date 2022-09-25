import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsSemVer, IsString } from 'class-validator';

export class IGetStakeHistoryQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 50;

  @ApiProperty({
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset: number = 0;
}

export class IGetStakeHistoryResponse {
  @IsString()
  date: string = '2022-09-23';

  @IsString()
  txHistory: string = '0x20d29d7fc57a274dd7a5c8a39b6a672a79c8d51efd66b9f0f63a03ab7460cf7a';

  @ApiProperty({
    example: {
      amount: '0.2',
      poolId: 3,
      stakingPeriodEnd: 1664529121000,
      apr: 40,
      chainId: 43113,
      currency: 'AVAX',
      decimal: 18,
      serviceFee: '10',
    },
  })
  @IsObject()
  stakeInfo: { [key: string]: any };
}
