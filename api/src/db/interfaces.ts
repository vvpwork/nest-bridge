import { ACCOUNT_TYPES, BALANCE_STATUSES, NOTIFICATION_TYPES, PROFILE_SECTIONS, PROFILE_STATUS } from './enums';
import { MetadataObject, ProfileSocials } from './types';

export interface IProfileModel {
  id: number;
  cover: string;
  status: PROFILE_STATUS;
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
  id: string;
  profileId: number;
  profile?: IProfileModel;
  securitizeId: string;
  status: PROFILE_STATUS;
  accountType: ACCOUNT_TYPES;
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
  id?: string;
  identityId: string;
  name: string;
  description: string;
  masterAddress?: string;
  cover: string;
  logo: string;
  symbol: string;
  salt: number;
  chainId: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface INftModel {
  id: string;
  collectionId: string;
  thumbnail: string;
  amount: number;
  // only after get blockchain
  ownerBalance?: number;
  metadata: MetadataObject;
  creatorIds: string[];
  royaltyIds: string[];
  royalty: number;
  totalSupply: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface IIdentityBalanceModel {
  id?: string;
  identityId: string;
  nftId: string;
  amount: number;
  status: BALANCE_STATUSES;
  createdAt?: any;
  updatedAt?: any;
}

export interface IIdentityNftBalanceLock {
  id: number;
  identityNftBalanceId: string;
  amount: number;
  unlockTime: number;
  createdAt: any;
  updatedAt: any;
}

export interface ITransactionHistory {
  id?: number;
  nft?: any;
  identityId: string;
  address?: string;
  nftId: string;
  amount: number;
  price: string;
  txHash: string;
  data?: unknown;
  type: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface IOrderModel {
  id?: string;
  nftIdentityBalanceId: string;
  amount: number;
  price: string;
  currency: string;
  signature: any;
  metadata: any;
  total?: number;
  totalPrice?: string;
  totalAmount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface INftLikeModel {
  id?: number;
  profileId: number;
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

export interface ICurrenciesModel {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
}

export interface IBlockchainIdentityAddress {
  id?: number;
  chainId: number;
  identityId: string;
  address: string;
  description?: string;
}

export interface IIdentityNftCreatorModel {
  identityId: number;
  address: string;
  nftId: string;
}
