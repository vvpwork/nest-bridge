import { IsNumber, IsString } from 'class-validator';

export class INftHistoryByUSDC {
  @IsString()
  identityId: string = 'jdhwjhd';

  @IsString()
  totalUSDC: string = '12000';

  @IsNumber()
  totalAmount: number = 1000;
}
