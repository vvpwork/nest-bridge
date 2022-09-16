import { ApiProperty } from '@nestjs/swagger';
import { NewsResponseDto } from '@Modules/news/dtos';
import { PaginationResponseDto } from '@Common/dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class FollowResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  profileId: number;

  @ApiProperty({
    type: String,
    example: 'testUserName123',
  })
  userName: string;

  @ApiProperty({
    type: String,
    example: 'https://someImage',
  })
  avatar: string;

  @ApiProperty({
    type: Number,
    example: 445,
  })
  followers: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isFollower: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isPartner: boolean;

  @ApiProperty({
    type: String,
    example: '0x423cbE3E6479E86dfb816915c5BF57060e48C5A7',
  })
  address: string;
}

export class IProfileFollowResponseDto {
  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;

  @ApiProperty({ type: () => [FollowResponseDto] })
  data: FollowResponseDto[];
}
