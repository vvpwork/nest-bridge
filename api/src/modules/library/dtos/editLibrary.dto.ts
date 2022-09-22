import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class EditLibraryDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  public image?: string;

  @IsString()
  @IsOptional()
  public source?: string;
}
