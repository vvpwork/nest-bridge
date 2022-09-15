import { ApiProperty } from '@nestjs/swagger';
import { PodcastResponseDto } from '@Modules/podcast/dtos';
import { PaginationResponseDto } from '@Common/dto';

export class IProfilePodcastResponseDto {
  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;

  @ApiProperty({ type: () => [PodcastResponseDto] })
  data: PodcastResponseDto[];
}
