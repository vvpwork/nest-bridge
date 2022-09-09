import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum StatusesType {
  onSale = 'onSale',
  onLocked = 'onLocked',
  notForSale = 'notForSale',
}

export class INftQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  identityId: number;

  @IsOptional()
  @IsString()
  collectionId: number;

  @IsOptional()
  @IsEnum(StatusesType)
  status: StatusesType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number;
}
