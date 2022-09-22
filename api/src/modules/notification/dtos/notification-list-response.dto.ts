import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NOTIFICATION_TYPES } from '@DB/enums';

export class NotificationListResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
    example: 1,
  })
  @IsEnum(NOTIFICATION_TYPES)
  type: NOTIFICATION_TYPES;

  @ApiProperty({
    example: {
      id: 2,
    },
  })
  params: any;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isRead: boolean;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  createdAt: string;
}

export class INotificationListResponseDto {
  @ApiProperty({ type: () => NotificationListResponseDto })
  data: NotificationListResponseDto[];
}
