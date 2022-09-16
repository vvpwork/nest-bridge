import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class IBuyOrderRequest {
  @IsString()
  orderId: string;

  @IsNumber()
  buyAmount: number;

  @IsString()
  txHash: string;
}
