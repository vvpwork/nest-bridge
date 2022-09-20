import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiHeaderOptions, ApiHeader } from '@nestjs/swagger';

export class ICollectionCreateDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  symbol!: string;

  @IsNumber()
  @Type(() => Number)
  salt!: number;

  @IsNumber()
  @Type(() => Number)
  chainId!: number;
}

export class ICollectionCreate {
  @IsString()
  id: string = '0x7hdfj98....';

  @IsNumber()
  identityId: number = 1;

  @IsString()
  name: string = 'Test Collection';

  @IsString()
  description: string = 'Test Collection';

  @IsString()
  symbol: string = 'TST';

  @IsString()
  cover: string = 'http://res.cloudinary.com/b';

  @IsString()
  avatar: string = 'http://res.cloudinary.com/b';

  @IsNumber()
  salt: number = 8921892;

  @IsNumber()
  chainId: number = 43113;
}
