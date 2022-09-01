/* eslint-disable @typescript-eslint/typedef */
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */
export class ProfileDto {
  @IsNumber()
  public id!: number;

  @IsString()
  public title!: string;

  @IsOptional()
  @IsString()
  public content?: string; // optional value

  @IsDateString() // ISO 8601
  public date: string = new Date().toISOString(); // default value

  @IsNotEmpty()
  public something!: string;

  @IsNumber()
  public page = 1;
}
