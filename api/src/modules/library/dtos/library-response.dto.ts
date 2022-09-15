import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LibraryResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  profileId: number;

  @ApiProperty({
    type: String,
    example: 'Library titleeee',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    example: 'https://someImage',
  })
  @IsString()
  image: string;

  @ApiProperty({
    type: String,
    example: 'https://someLink.html',
  })
  @IsString()
  source: string;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  createdAt: string;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  updatedAt: string;
}

export class ILibraryResponseDto {
  @ApiProperty({ type: () => LibraryResponseDto })
  data: LibraryResponseDto;
}
