import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class CreateNewsDto {
  @IsString()
  public title!: string;

  @IsString()
  public description!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public image!: string;

  @IsString()
  public source!: string;
}
