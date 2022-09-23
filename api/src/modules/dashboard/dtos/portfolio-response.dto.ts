import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@Common/dto';
import { TransactionDataDto, TransactionsType } from '@Modules/transaction-history/dtos';
import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class PortfolioResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  identityId: number;

  @ApiProperty({
    type: String,
    example: 'kijuhygtfrtgdyhufjiskouygetyhrjikbtlg',
  })
  nftId: string;

  @ApiProperty({
    type: Number,
    example: 123444,
  })
  amount: number;

  @ApiProperty({
    type: String,
    example: '33333',
  })
  price: string;

  @ApiProperty({
    type: String,
    example: '0x...................',
  })
  address: string;

  @ApiProperty({
    type: String,
    example: '0x.......................',
  })
  txHash: string;

  @ApiProperty({
    type: String,
    example: true,
  })
  @IsEnum(TransactionsType)
  type: TransactionsType;

  @ApiProperty({
    type: Object,
    example: {
      isClaimed: false,
    },
  })
  data: TransactionDataDto;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  createdAt: string;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  updatedAt: string;
}

export class IPortfolioResponseDto {
  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;

  @ApiProperty({ type: () => [PortfolioResponseDto] })
  data: PortfolioResponseDto[];
}
