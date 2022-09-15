/* eslint-disable @typescript-eslint/typedef */
import { IsEnum, IsString } from 'class-validator';
import { ProfileSocialsDto } from '@Modules/profile/dtos';
import { Type } from 'class-transformer';
import { PROFILE_SECTIONS } from '@Common/enums';
import { ProfileSocials } from '@Common/types';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class IProfileResponseDto {
  @ApiProperty({
    example: 3,
    type: Number,
  })
  public id: number;

  @ApiProperty({
    example: 'some name',
    type: String,
  })
  public name: string;

  @ApiProperty({
    example: 'myUserName',
    type: String,
  })
  public userName: string;

  @ApiProperty({
    example: 'https://dfsfd.com',
    type: String,
  })
  public website: string;

  @ApiProperty({
    example: 'sfas@gmail.com',
    type: String,
  })
  public email: string;

  @ApiProperty({
    example: 'https://dfsfd.com',
    type: String,
  })
  @IsString()
  public cover: string;

  @ApiProperty({
    example: 'https://dfsfd.com',
    type: String,
  })
  @IsString()
  public avatar: string;

  @ApiProperty({
    example: 'https://dfsfd.com',
    type: String,
  })
  @IsString()
  public communityLink: string;

  @ApiProperty({
    example: 'lorem ipsum dolor.....',
    type: String,
  })
  @IsString()
  public bio: string;

  @ApiProperty({
    example: {
      twitter: 'http://t.co/vdsfs',
    },
  })
  @Type(() => ProfileSocialsDto)
  public socials: ProfileSocials;

  @ApiProperty({
    example: ['news', 'library', 'podcasts', 'community'],
  })
  @IsEnum(PROFILE_SECTIONS)
  public sections: PROFILE_SECTIONS;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  createdAt: string;

  @ApiProperty({
    type: Date,
    example: '2022-09-13T13:02:38.000Z',
  })
  updatedAt: string;
}
