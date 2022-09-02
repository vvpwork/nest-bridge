/* eslint-disable @typescript-eslint/typedef */
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDefined,
  IsEmail,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ProfileSocialsDto } from '@Modules/profile/dtos/profileSocialsDto.dto';
import { Type } from 'class-transformer';
import { PROFILE_SECTIONS } from '@Common/enums';
import { ProfileSocials } from '@Common/types';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class EditProfileDto {
  @IsString()
  @Length(1, 254)
  @IsOptional()
  public cover?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public avatar?: string;

  @IsString()
  @Length(1, 30)
  @IsOptional()
  public name?: string;

  @IsString()
  @Length(1, 30)
  @IsOptional()
  public userName?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public website?: string;

  @IsString()
  @Length(1, 254)
  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @Length(1, 254)
  @IsOptional()
  public communityLink?: string;

  @IsString()
  @Length(1, 1000)
  @IsOptional()
  public bio?: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ProfileSocialsDto)
  public socials?: ProfileSocials;

  @ArrayNotEmpty()
  @ArrayUnique()
  @IsOptional()
  public sections?: PROFILE_SECTIONS[];
}
