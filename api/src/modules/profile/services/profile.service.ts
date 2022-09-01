import { Injectable } from '@nestjs/common';
import { ProfileEntity } from '@DB/models/Profile.entity';

@Injectable()
export class ProfileService {
  getById(id: number): Promise<ProfileEntity> {
    return ProfileEntity.findByPk(id);
  }
}
