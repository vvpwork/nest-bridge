/* eslint-disable @typescript-eslint/ban-types */
import { IsNumber, IsObject, IsString } from 'class-validator';

export class INftPnlHistory {
  @IsString()
  date: string = '2022-09-23';

  @IsString()
  totalNfts: string = '6000000';

  @IsObject()
  stakedData: [{}] = [
    {
      amount: '0.2',
      poolId: 3,
      stakingPeriodEnd: 1664529121000,
      apr: 40,
      chainId: 43113,
      currency: 'AVAX',
      decimal: 18,
      serviceFee: '10',
    },
  ];

  @IsObject()
  balances: [{}] = [
    {
      ethBalance: '3782748274',
      avaxBalance: '78375835635',
      usdcBalance: '683586385683',
    },
  ];
}
