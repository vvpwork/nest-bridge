/* eslint-disable @typescript-eslint/ban-types */
import { IsNumber, IsObject, IsString } from 'class-validator';

export class INftPnlHistory {
  @IsString()
  date: string = '2022-09-23';

  @IsString()
  totalNfts: string = '6000000';

  @IsObject()
  stakedData: [{ data: any; txHash: string }] = [
    {
      data: {
        amount: '0.2',
        poolId: 3,
        stakingPeriodEnd: 1664529121000,
        apr: 40,
        chainId: 43113,
        currency: 'AVAX',
        decimal: 18,
        serviceFee: '10',
      },
      txHash: '0x20d29d7fc57a274dd7a5c8a39b6a672a79c8d51efd66b9f0f63a03ab7460cf7a',
    },
  ];

  @IsString()
  balanceAvax: string = '29017440488174113235';
}
