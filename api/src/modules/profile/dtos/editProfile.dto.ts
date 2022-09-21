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
import { ProfileSocialsDto } from '@Modules/profile/dtos';
import { Type } from 'class-transformer';
import { PROFILE_SECTIONS } from '@DB/enums';
import { ProfileSocials } from '@DB/types';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class EditProfileDto {
  @IsString()
  @IsDefined()
  @IsOptional()
  public name?: string | null;

  @IsString()
  @Length(0, 30)
  @IsDefined()
  @IsOptional()
  public userName?: string | null;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsDefined()
  @IsOptional()
  public avatar?: string | null;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsDefined()
  @IsOptional()
  public cover?: string | null;

  @IsString()
  @Length(0, 254)
  @IsDefined()
  @IsOptional()
  public website?: string | null;

  @IsString()
  @Length(0, 254)
  @IsEmail()
  @IsDefined()
  @IsOptional()
  public email?: string | null;

  @IsString()
  @Length(0, 254)
  @IsDefined()
  @IsOptional()
  public communityLink?: string | null;

  @IsString()
  @Length(0, 1000)
  @IsDefined()
  @IsOptional()
  public bio?: string | null;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ProfileSocialsDto)
  public socials?: ProfileSocials | null;

  @ArrayNotEmpty()
  @ArrayUnique()
  @IsDefined()
  @IsOptional()
  public sections?: PROFILE_SECTIONS[] | null;
}
