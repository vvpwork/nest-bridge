import { IsOptional, IsString, Length } from 'class-validator';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class EditPodcastDto {
  @IsString()
  @Length(1, 200)
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  @Length(1, 30)
  public source?: string;
}
