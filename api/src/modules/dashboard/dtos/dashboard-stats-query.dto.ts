import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

enum AssetsType {
  staked = 'staked',
}

enum Blockchains {
  ethereum = 'ethereum',
  avalanche = 'avalanche',
}

export class IDashboardStatsQueryDto {
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
}
