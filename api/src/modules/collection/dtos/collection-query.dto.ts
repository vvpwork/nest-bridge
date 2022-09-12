import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ICollectionQueryDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  identityId: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  collectionId: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withNft: boolean = false;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number = 0;
}
