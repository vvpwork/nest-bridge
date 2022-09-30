export enum PROFILE_SECTIONS {
  NEWS = 'news',
  LIBRARY = 'library',
  PODCASTS = 'podcasts',
  COMMUNITY = 'community',
}

export enum ACCOUNT_TYPES {
  USER = 'user',
  PARTNER = 'partner',
}

export enum PROFILE_STATUS {
  IN_PROGRESS = 'IN_PROGRESS',
  VERIFIED = 'VERIFIED',
  CONTACT_SUPPORT = 'CONTACT_SUPPORT',
  UPDATES_REQUIRED = 'UPDATES_REQUIRED',
}

export enum BALANCE_STATUSES {
  UNLOCKED = 'unlocked',
  LOCKED = 'locked',
}

export enum NOTIFICATION_TYPES {
  NFT_SOLD = 'nftSold',
  ROYALTY_RECEIVED = 'royaltyReceived',
  NEW_FOLLOWER = 'newFollower',
  FOLLOWING_PERSON_LISTS_NFT = 'followingPersonListsNft',
  FOLLOWING_PERSON_ADDED_NEWS = 'followingPersonAddedNews',
  FOLLOWING_PERSON_ADDED_PODCAST = 'followingPersonAddedPodcast',
  FOLLOWING_PERSON_ADDED_LIBRARY = 'followingPersonAddedLibrary',
  NFTS_UNLOCKED = 'nftsUnlocked',
}

export enum HISTORY_TYPES {
  BUY = 'buy',
  SELL = 'sell',
  LIST = 'list',
  UNLIST = 'unlist',
  PRICE_UPDATE = 'priceUpdate',
  ROYALTY_RECEIVE = 'royaltyReceive',
  STAKE = 'stake',
  CLAIM = 'claim',
  BUY_DIGITAL_SECURITY = 'buyDigitalSecurity',
}
