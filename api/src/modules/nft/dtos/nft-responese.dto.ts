/* eslint-disable max-classes-per-file */
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

class IProfileData {
  id: number;
  cover: string;
  avatar: string;
  name: string;
  status: string;
  accountType: string;
}
class IOwners {
  @IsString()
  identityId: string = '626b881ce1358f001420e238';

  @IsString()
  address: string = '0x0aFD4FCef8C90E822fadE0472d7f4b31496Cf2e8';

  @IsString()
  status: string = 'in_progress';

  @IsString()
  accountType: string = 'user';

  @ApiProperty({
    example: {
      id: 1,
      avatar: 'http://logo-url',
      cover: 'http://cover-url',
      name: 'test',
      status: 'in_progress',
      accountType: 'user',
    },
  })
  @Type(() => IProfileData)
  @ValidateNested()
  profile: IProfileData;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  onSale: number | null;

  @ApiProperty({
    example: {
      id: 'hdhjdwjkd',
      amount: 2,
      price: '1000000',
      signature: { test: 'test' },
      decimals: 6,
      currency: 'USDC',
    },
    isArray: true,
  })
  @Type(() => IOnSalesData)
  @ValidateNested()
  onSalesData: IOnSalesData[] | null;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  identityBalance: number;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  lockedBalance: number | null;

  @ApiProperty({
    example: [{ amount: 2, unlockTime: 1660067913 }],
  })
  @Type(() => ILockDataDto)
  @ValidateNested()
  lockedData: ILockDataDto[];

  @IsNumber()
  isLiked: number = 0;

  @IsNumber()
  likesCount: number = 0;
}

export class INftResponse {
  @ApiProperty({
    type: String,
    example: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_1',
  })
  id: string;

  @ApiProperty({
    example: {
      name: 'test',
      description: 'test description',
    },
  })
  metadata: any;

  @ApiProperty({
    example: 'imageKeyCloudinary',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    type: Number,
    example: 1000,
  })
  royalty: number;

  @ApiProperty({
    example: 1000,
  })
  @IsNumber()
  totalNftAmount: number;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  totalSupply: 1000;

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
    example: {
      address: '0x3C865AC4Bd0B7652Aab04e94E1a14ED39c868879',
      identityId: '626b881ce1358f001420e238',
      name: 'testUser',
      userName: 'testUser1',
      avatar: 'https://test',
      accountType: 'user',
    },
    isArray: true,
  })
  creatorsData: any[];

  @ApiProperty({
    example: {
      identityId: '626b881ce1358f001420e238',
      address: '0x0aFD4FCef8C90E822fadE0472d7f4b31496Cf2e8',
      status: 'in_progress',
      accountType: 'user',
      identityBalance: 200,
      profile: {
        id: 1,
        cover: 'https://test',
        avatar: 'https://test',
        name: 'testUser',
      },
      lockedData: null,
      lockedBalance: null,
      isLiked: 1,
      likesCount: 1,
      onSale: 20,
      onSalesData: [
        {
          id: '0x8dcF19AeE31F9624F',
          amount: 20,
          price: '10000000',
          signature: {
            test: 'test',
          },
          decimals: 6,
          currency: 'USDC',
        },
      ],
    },
    isArray: true,
  })
  @Type(() => IOwners)
  @ValidateNested()
  owners: IOwners[];
}
