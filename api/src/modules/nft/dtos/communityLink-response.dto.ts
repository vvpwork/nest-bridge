import { ApiProperty } from '@nestjs/swagger';

export class ICommunityLinkResponseDto {
  @ApiProperty({
    type: String,
    example: 'https://mycommunity.com',
  })
  data: string;
}
