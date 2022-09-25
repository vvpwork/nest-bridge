import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IAdditionalInfo } from '@/modules/transaction-history/dtos';

export class IBuyOrderRequest {
  @IsString()
  orderId: string;

  @IsNumber()
  buyAmount: number;

  @IsString()
  txHash: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IAdditionalInfo)
  public additionalInfo?: IAdditionalInfo;
}
