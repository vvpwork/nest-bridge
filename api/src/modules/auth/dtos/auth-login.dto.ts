import { IsNumber, IsString } from 'class-validator';
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

export class ILoginResponse {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. ...',
  })
  token: string;
}
