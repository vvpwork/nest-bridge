import { IsString } from 'class-validator';

export class ICollectionReadDto {
  @IsString()
  id: string;
}
