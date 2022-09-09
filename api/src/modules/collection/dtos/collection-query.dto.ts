import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ICollectionQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  identityId: number;
}
