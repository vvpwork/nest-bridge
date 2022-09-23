import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class CreateLibraryDto {
  @IsString()
  public title!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public image!: string;

  @IsString()
  public source!: string;
}
