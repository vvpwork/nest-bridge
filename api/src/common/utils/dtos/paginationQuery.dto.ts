import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class PaginationQueryDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  offset?: number;
}
