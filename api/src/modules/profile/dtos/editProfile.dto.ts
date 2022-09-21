/* eslint-disable @typescript-eslint/typedef */
import { IsDefined, IsEmail, IsOptional, IsString, Length } from 'class-validator';

import { PROFILE_SECTIONS } from '@DB/enums';

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

  @IsOptional()
  public socials?: any;

  @IsDefined()
  @IsOptional()
  public sections?: PROFILE_SECTIONS[] | any[];
}
