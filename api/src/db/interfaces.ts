import { ACCOUNT_TYPES, BALANCE_STATUSES, NOTIFICATION_TYPES, PROFILE_SECTIONS } from './enums';
import { MetadataObject, ProfileSocials } from './types';

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
  profileId: number;
  targetProfileId: number;
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

export interface INftModel {
  id: string;
  collectionId: string;
  tokenId: string;
  thumbnail: string;
  amount: number;
  metadata: MetadataObject;
  creatorIds: string[];
  royaltyIds: string[];
  royalty: number;
  totalSupply: number;
  createdAt: any;
  updatedAt: any;
}

export interface IIdentityBalanceModel {
  id: number;
  identityId: number;
  nftId: string;
  amount: number;
  status: BALANCE_STATUSES;
  createdAt: any;
  updatedAt: any;
}

export interface IIdentityNftBalanceLock {
  id: number;
  identityNftBalanceId: number;
  amount: number;
  unlockTime: number;
  createdAt: any;
  updatedAt: any;
}

export interface ITransactionHistory {
  id: number;
  identityId: number;
  nftId: string;
  amount: number;
  price: string;
  txHash: string;
  type: string;
  createdAt: any;
  updatedAt: any;
}

export interface IOrderModel {
  id: number;
  identityId: number;
  nftId: string;
  amount: number;
  price: string;
  decimals: string;
  signature: string;
  metadata: any;
  createdAt: any;
  updatedAt: any;
}

export interface INftLikeModel {
  id: number;
  identityId: number;
  nftId: string;
  createdAt: any;
  updatedAt: any;
}

export interface ILibraryModel {
  id: string;
  profileId: number;
  title: string;
  image: string;
  source: string;
  createdAt: any;
  updatedAt: any;
}

export interface IPodcastModel {
  id: string;
  profileId: number;
  title: string;
  description: string;
  image: string;
  source: string;
  createdAt: any;
  updatedAt: any;
}

export interface INewsModel {
  id: string;
  profileId: number;
  title: string;
  description: string;
  image: string;
  source: string;
  likesCount: number;
  isLiked: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface INewsLikeModel {
  id: string;
  profileId: number;
  newsId: string;
  createdAt: any;
  updatedAt: any;
}

export interface INotificationModel {
  id: number;
  profileId: number;
  params: any;
  type: NOTIFICATION_TYPES;
  isRead: boolean;
  createdAt: any;
  updatedAt: any;
}
