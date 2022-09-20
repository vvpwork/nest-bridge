import { ApiResponse, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum StatusesType {
  onSale = 'onSale',
  onLocked = 'onLocked',
  notForSale = 'notForSale',
}

export enum SortValues {
  price = 'price',
  created = 'created',
  unlockedTime = 'unlockTime',
}

export enum SortTypes {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class INftQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  identityId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  creatorId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  nftId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusesType)
  status: StatusesType;

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

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(SortValues)
  sortValue: SortValues;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEnum(SortTypes)
  sortType: SortTypes;
}
