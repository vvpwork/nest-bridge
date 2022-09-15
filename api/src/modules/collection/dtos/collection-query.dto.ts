import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ICollectionQueryDto {
  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @Type(() => String)
  // @IsString()
  // identityId: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @Type(() => String)
  // @IsString()
  // collectionId: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @Type(() => Boolean)
  // @IsBoolean()
  // withNft: boolean = false;

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
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number = 0;
}
