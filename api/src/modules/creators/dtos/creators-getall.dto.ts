import { ApiProperty } from '@nestjs/swagger';
import { ClassTransformer, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ICretortsQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 50;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number = 0;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;
}

class ICreatorsResponseData {
  @IsString()
  address: string = '0x3C865AC4Bd0B7652Aab04e94E1a14ED39c868879';

  @IsString()
  avatar: string = 'https://test';

  @IsString()
  id: string = '626b881ce1358f001420e238';

  @IsString()
  userName: string = 'testUser1';

  @IsString()
  accountType: string = 'user';
}

export class ICreatorsResponse {
  @Type(() => ICreatorsResponseData)
  data: ICreatorsResponseData[];
}
