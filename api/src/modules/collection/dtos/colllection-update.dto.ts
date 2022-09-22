import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class ICollectionUpdateParam {
  @IsString()
  id: string;
}
export class ICollectionUpdateDto {
  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  masterAddress!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsDefined()
  @IsOptional()
  public logo?: string | null;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsDefined()
  @IsOptional()
  public cover?: string | null;
}
