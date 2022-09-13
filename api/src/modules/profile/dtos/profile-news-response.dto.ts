import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { INewsResponseDto } from '@Modules/news/dtos';

export class IProfileNewsResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  total: number;

  @ApiProperty({ type: () => [INewsResponseDto] })
  data: INewsResponseDto[];
}
