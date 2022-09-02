import { IsString, Length } from 'class-validator';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class CreateLibraryDto {
  @IsString()
  @Length(1, 200)
  public title!: string;

  @IsString()
  @Length(1, 254)
  public image!: string;

  @IsString()
  @Length(1, 30)
  public source!: string;
}
