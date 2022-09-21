import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IDeleteOrderParam {
  @ApiProperty({
    example: 'ter-4d7hs-...',
  })
  @IsString()
  id: string;
}

export class IDeleteOrderQuery {
  @ApiProperty({
    example: '0xkedjfkwjf....',
  })
  @IsString()
  txHash: string;
}
