import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class EditNewsDto {
  @IsString()
  @Length(1, 200)
  @IsOptional()
  public title?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  public image?: string;

  @IsString()
  @IsOptional()
  @Length(1, 30)
  public source?: string;
}
