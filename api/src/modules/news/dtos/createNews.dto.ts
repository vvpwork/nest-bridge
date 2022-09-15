import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class CreateNewsDto {
  @IsString()
  @Length(1, 200)
  public title!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public image!: string;

  @IsString()
  @Length(1, 30)
  public source!: string;
}
