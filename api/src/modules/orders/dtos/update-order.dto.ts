import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsNumber, IsUUID, IsOptional, IsString, IsObject } from 'class-validator';
import { ICreateOrderResponseDto } from './order-create.dto';

export class IUpdateOrderDto {
  @ApiProperty({
    example: '14a13436-3379-...',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '5000',
  })
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  signature: string;

  @ApiProperty({
    examples: {
      test: 'test',
    },
  })
  @IsOptional()
  @IsObject()
  metadata: { [key: string]: any };
}

export class IUpdateOrderResponseDto extends ICreateOrderResponseDto {}
