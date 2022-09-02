import { ProfileEntity } from '@DB/models';
import { PROFILE_REPOSITORY } from '@Common/constants';

export const profileProviders = [
  {
    provide: PROFILE_REPOSITORY,
    useValue: ProfileEntity,
  },
];
