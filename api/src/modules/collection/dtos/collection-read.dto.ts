import { IsString } from 'class-validator';
import { ICollectionCreate } from './collection-create.dto';

export class ICollectionReadDto {
  @IsString()
  id: string;
}

class ICollectionIdentity {
  id: string = '756b354ce1358f001420e238';
  name: string = 'userName2';
  userName: string = 'testUser2';
  email: string = 'test@email.com';
  status: string = 'in_progress';
  accountType: string = 'user';
  cover: string = 'https://test';
  avatar: string = 'https://test';
}
export class ICollectionResponse extends ICollectionCreate {
  identity: ICollectionIdentity;
}
