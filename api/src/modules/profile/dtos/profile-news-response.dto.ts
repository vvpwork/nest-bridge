import { ApiProperty } from '@nestjs/swagger';
import { NewsResponseDto } from '@Modules/news/dtos';
import { PaginationResponseDto } from '@Common/dto';

export class IProfileNewsResponseDto {
  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;

  @ApiProperty({ type: () => [NewsResponseDto] })
  data: NewsResponseDto[];
}
