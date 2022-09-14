import { IsOptional, IsString, Length } from 'class-validator';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class CreatePodcastDto {
  @IsString()
  @Length(1, 200)
  public title!: string;

  @IsString()
  @Length(1, 30)
  public source!: string;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  public description?: string;
}
