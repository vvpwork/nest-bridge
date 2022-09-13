import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IPodcastResponseDto } from '@Modules/podcast/dtos';

export class IProfilePodcastResponseDto {
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

  @ApiProperty({ type: () => [IPodcastResponseDto] })
  data: IPodcastResponseDto[];
}
