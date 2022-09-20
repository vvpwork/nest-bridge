import { IsNumber, IsString } from 'class-validator';

export class ICollectionUpdateParam {
  @IsString()
  id: string;
}

export class ICollectionUpdateDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  symbol!: string;
}
