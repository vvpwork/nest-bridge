import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  isString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';

export class ICreateOrderDto {
  @IsOptional()
  @IsString()
  identityId: string;

  @IsNumber()
  amount: number;

  @IsString()
  price: string;

  @IsString()
  currency: string = 'USDC';

  @IsOptional()
  @IsString()
  signature: string;

  @IsString()
  nftId: string;

  @ApiProperty({
    examples: {
      test: 'test',
    },
  })
  @IsOptional()
  @IsObject()
  metadata: { [key: string]: any };
}

export class ICreateOrderResponseDto {
  @IsString()
  id: string = '13ebcaa8b771-...';

  @IsNumber()
  amount: number = 1;

  @IsString()
  price: string = '10000';

  @IsString()
  currency: string = 'USDC';

  @ApiProperty({
    example: { test: 'test' },
  })
  @IsObject()
  @Type(() => Object)
  signature: { [key: string]: any };

  @ApiProperty({
    example: { test: 'test' },
  })
  @IsObject()
  @Type(() => Object)
  metadata: { [key: string]: any };

  createdAt: Date;
  updatedAt: Date;
}
