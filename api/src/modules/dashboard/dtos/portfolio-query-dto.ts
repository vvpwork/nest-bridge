import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '@Common/dto';

export enum AssetsType {
  staked = 'staked',
  digitalSecurity = 'digitalSecurity',
}

export enum Blockchains {
  ethereum = 'ethereum',
  avalanche = 'avalanche',
}

export class IPortfolioQueryDto extends PaginationQueryDto {
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
