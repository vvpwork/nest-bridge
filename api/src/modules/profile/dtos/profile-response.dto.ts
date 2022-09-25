/* eslint-disable @typescript-eslint/typedef */
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ProfileSocialsDto } from '@Modules/profile/dtos';
import { Type } from 'class-transformer';
import { PROFILE_SECTIONS } from '@DB/enums';
import { ProfileSocials } from '@DB/types';
import { ApiProperty } from '@nestjs/swagger';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class IProfileResponseDto {
  @ApiProperty({
    example: 'dhwhdjw',
    type: Number,
  })
  public id: string;

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

export class IProfileResponse {
  @IsString()
  id: string = 'de4cab06-964e-4d37-a17b-cf799cdcf32f';

  @IsString()
  securitizeId: string = '62b309e5db759500127a9cc1';

  @IsString()
  status: string = 'verified';

  @IsString()
  accountType: string = 'partner';

  @IsString()
  profileId: number = 9;

  @IsString()
  createdAt: string = '2022-09-20T18:56:47.000Z';

  @IsString()
  updatedAt: string = '2022-09-21T07:56:23.000Z';

  @IsString()
  address: string = '0x423cbE3E6479E86dfb816915c5BF57060e48C5A7';

  @IsString()
  name: string = 'Artemundi';

  @IsString()
  avatar: string =
    'http://res.cloudinary.com/bridgetowercapital/image/upload/v1660723691/vvp7cxxeuxkse4b7mm7z.jpg';

  @IsString()
  cover: string =
    'http://res.cloudinary.com/bridgetowercapital/image/upload/v1660723750/y6wdsoayuvnj8ugiukuw.jpg';

  @IsString()
  userName: string = 'Artemundi';

  @IsString()
  bio: string = 'djfkwjflkwf';

  @IsString()
  email: string = 'test@test.ua';

  @IsString()
  communityLink: string = null;

  @IsString()
  sections: string[] = [''];

  @IsNumber()
  isFollowing: number = 0;

  @IsNumber()
  followers: number = 0;

  @IsNumber()
  followings: number = 0;
}
