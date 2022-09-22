import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

enum AssetsType {
  staked = 'staked',
}

enum Blockchains {
  ethereum = 'ethereum',
  avalanche = 'avalanche',
}

class IDashboardStatsObjectDto {
  @ApiProperty({
    type: Date,
    example: '2022-09-20',
  })
  date: string;

  @ApiProperty({
    type: Number,
    example: 12345,
  })
  amount: string | null;

  @ApiProperty({
    type: String,
    example: '24234343243455',
  })
  price: string | null;
}

class IDashboardStatsDto {
  @Type(() => IDashboardStatsObjectDto)
  assets: IDashboardStatsObjectDto[];

  @Type(() => IDashboardStatsObjectDto)
  securities: IDashboardStatsObjectDto[];

  @Type(() => IDashboardStatsObjectDto)
  nfts: IDashboardStatsObjectDto[];
}

export class IDashboardStatResponseDto {
  @ApiProperty({
    type: IDashboardStatsDto,
  })
  @Type(() => IDashboardStatsDto)
  data: IDashboardStatsDto;
}
