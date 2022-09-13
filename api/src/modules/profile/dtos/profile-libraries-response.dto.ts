import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { ILibraryResponseDto } from '@Modules/library/dtos';

export class IProfileLibrariesResponseDto {
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

  @ApiProperty({ type: () => [ILibraryResponseDto] })
  data: ILibraryResponseDto[];
}
