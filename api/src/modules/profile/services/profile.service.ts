import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileEntity } from '@DB/models/Profile.entity';
import { EditProfileDto } from '@Modules/profile/dtos/editProfileDto.dto';

@Injectable()
export class ProfileService {
  async getById(id: number): Promise<ProfileEntity> {
    return ProfileEntity.findByPk(id);
  }

  async updateById(id: number, params: EditProfileDto): Promise<{ success: true }> {
    // eslint-disable-next-line no-param-reassign,security/detect-object-injection
    Object.keys(params).forEach((key: string) => (params[key] === undefined || params[key] === null ? delete params[key] : {}));

    if (params.userName && params.userName !== '') {
      const alreadyExists = await ProfileEntity.findOne({ where: { userName: params.userName }, attributes: ['id'], raw: true });
      if (alreadyExists) {
        throw new HttpException('USERNAME_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    if (params.email && params.email !== '') {
      const alreadyExists = await ProfileEntity.findOne({ where: { email: params.email }, attributes: ['id'], raw: true });
      if (alreadyExists) {
        throw new HttpException('EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    await ProfileEntity.update(params, { where: { id } });
    return { success: true };
  }
}
