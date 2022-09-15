/* eslint-disable max-classes-per-file */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { LibraryResponseDto } from '@Modules/library/dtos';

class IdentityResponseDto {
  @ApiProperty({
    type: Number,
    example: 3,
  })
  profileId: number;

  @ApiProperty({
    type: String,
    example: 'someName1',
  })
  userName: string;

  @ApiProperty({
    type: String,
    example: '0x................',
  })
  address: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isPartner: string;

  @ApiProperty({
    type: String,
    example: 'http://someLink.com/dfsfd.jpg',
  })
  type: string;
}

export class NftHistoryResponseDto {
  @ApiProperty({
    type: String,
    example: 'list',
  })
  type: string;

  @ApiProperty({
    type: Number,
    example: 4,
  })
  amount: number;

  @ApiProperty({
    type: String,
    example: '12345',
  })
  price: string;

  @ApiProperty({
    type: String,
    example: '0x.................',
  })
  txHash: string;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  createdAt: string;

  @ApiProperty({ type: () => IdentityResponseDto })
  identity: IdentityResponseDto;
}

export class INftHistoryResponseDto {
  @ApiProperty({ type: () => NftHistoryResponseDto })
  data: NftHistoryResponseDto;
}
