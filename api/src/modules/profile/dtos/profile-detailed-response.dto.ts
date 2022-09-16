/* eslint-disable @typescript-eslint/typedef */
import { IsEnum, IsString } from 'class-validator';
import { IProfileResponseDto, ProfileSocialsDto } from '@Modules/profile/dtos';
import { Type } from 'class-transformer';
import { PROFILE_SECTIONS } from '@Common/enums';
import { ProfileSocials } from '@Common/types';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class IProfileDetailedResponseDto extends IProfileResponseDto {
  @ApiProperty({
    example: 3,
    type: Number,
  })
  public followersCount: number;

  @ApiProperty({
    example: 2,
    type: Number,
  })
  public followingsCount: number;

  @ApiProperty({
    example: true,
    type: Boolean,
  })
  public isFollower: boolean;
}
