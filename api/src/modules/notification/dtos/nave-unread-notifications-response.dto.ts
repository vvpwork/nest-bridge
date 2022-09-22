import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class IHaveUnreadNotificationsResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  data: boolean;
}
