import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class ICollectionResponse {
  id: string;
  logo: string;
  cover: string;
  symbol: string;
}

class ILockDataDto {
  amount: number;
  unlockTime: number;
}

class IOnSalesData {
  id: string;
  amount: number;
  price: string;
  signature: { [key: string]: any };
  decimals: number;
  currency: string;
}

export class INftResponse {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  identityId: string;

  @ApiProperty({
    type: String,
    example: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3... ',
  })
  @IsString()
  nftId: string;

  @ApiProperty({
    example: {
      id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346489',
      logo: 'http://logo-url',
      cover: 'http://cover-url',
      symbol: 'PMT',
    },
  })
  @Type(() => ICollectionResponse)
  @ValidateNested()
  collectionData: ICollectionResponse;

  @ApiProperty({
    example: 1000,
  })
  @IsNumber()
  royalty: number;

  @ApiProperty({
    example: 1000,
  })
  @IsNumber()
  totalNftAmount: number;

  @ApiProperty({
    example: 'imageKeyCloudinary',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  totalSupply: 1000;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  identityBalance: number;

  @ApiProperty({
    example: [{ amount: 2, unlockTime: 1660067913 }],
  })
  @Type(() => ILockDataDto)
  @ValidateNested()
  lockedData: ILockDataDto[];

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  lockedBalance: number | null;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  onSale: number | null;

  @ApiProperty({
    example: [
      {
        id: 'hdhjdwjkd',
        amount: 2,
        price: '1000000',
        signature: { test: 'test' },
        decimals: 6,
        currency: 'USDC',
      },
    ],
  })
  @Type(() => IOnSalesData)
  @ValidateNested()
  onSalesData: IOnSalesData[] | null;
}
