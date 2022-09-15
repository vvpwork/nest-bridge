import { ApiProperty } from '@nestjs/swagger';
import { LibraryResponseDto } from '@Modules/library/dtos';
import { PaginationResponseDto } from '@Common/dto';

export class IProfileLibrariesResponseDto {
  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;

  @ApiProperty({ type: () => [LibraryResponseDto] })
  data: LibraryResponseDto[];
}
