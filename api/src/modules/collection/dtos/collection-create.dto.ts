import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiHeaderOptions, ApiHeader } from '@nestjs/swagger';

export class ICollectionCreateDto {
  @IsString()
  id!: string;

  @IsNumber()
  @Type(() => Number)
  identityId!: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  symbol!: string;

  @IsNumber()
  @Type(() => Number)
  salt!: number;

  @IsNumber()
  @Type(() => Number)
  chainId!: number;
}

export class ICollectionCreate {
  @IsString()
  id: string;

  @IsNumber()
  identityId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  symbol: string;

  @IsNumber()
  salt: number;

  @IsNumber()
  chainId: number;
}
