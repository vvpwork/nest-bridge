/* eslint-disable @typescript-eslint/typedef */
import { IsOptional, IsString, Length } from 'class-validator';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class ProfileSectionsDto {
  @IsString()
  @Length(1, 254)
  @IsOptional()
  public twitter?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public facebook?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public instagram?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public medium?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public telegram?: string;
}
