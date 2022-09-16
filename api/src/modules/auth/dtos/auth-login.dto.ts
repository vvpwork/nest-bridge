import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiHeaderOptions, ApiHeader } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  public address!: string;

  @IsNumber()
  public chainId!: number;

  @IsString()
  public code!: string;
}

export class ILoginResponseData {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. ...',
  })
  @IsString()
  token: string;

  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. ...',
  })
  @IsOptional()
  @IsString()
  whiteListTransaction: string;
}

export class ILoginResponse {
  data: ILoginResponseData;
}
