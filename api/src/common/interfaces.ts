import { ProfileSocials } from '@Common/types';
import { ACCOUNT_TYPES, PROFILE_SECTIONS } from '@Common/enums';

export interface IConfig {
  db: {
    host: string;
    port: number;
    password: string;
    database: string;
    username: string;
    dialect: any;
  };
}

export interface IProfileModel {
  id: number;
  cover: string;
  avatar: string;
  userName: string;
  bio: string;
  email: string;
  communityLink: string;
  socials: ProfileSocials;
  website: string;
  sections: PROFILE_SECTIONS[];
  createdAt: any;
  updatedAt: any;
}

export interface IIdentityModel {
  id: number;
  profileId: number;
  address: string;
  securitizeId: string;
  accountType: ACCOUNT_TYPES;
  nonce: string;
  createdAt: any;
  updatedAt: any;
}

export interface IFollowerModel {
  identityId: number;
  targetIdentityId: number;
  createdAt: any;
  updatedAt: any;
}

export interface IBlockchainModel {
  chainId: number;
  name: string;
  description: string;
}

export interface ICollectionModel {
  id: string;
  identityId: number;
  name: string;
  description: string;
  cover: string;
  logo: string;
  chainId: number;
  createdAt: any;
  updatedAt: any;
}
