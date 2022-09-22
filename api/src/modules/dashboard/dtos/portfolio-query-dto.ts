import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum AssetsType {
  staked = 'staked',
  digitalSecurity = 'digitalSecurity',
}

export enum Blockchains {
  ethereum = 'ethereum',
  avalanche = 'avalanche',
}

export class IPortfolioQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(AssetsType)
  asset?: AssetsType;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(Blockchains)
  blockchain?: Blockchains;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  offset?: number;
}
