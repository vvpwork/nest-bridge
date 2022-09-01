import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
  @IsString()
  public address!: string;

  @IsString()
  public signature!: string;

  @Type(() => String)
  @IsString()
  public code!: string;
}
