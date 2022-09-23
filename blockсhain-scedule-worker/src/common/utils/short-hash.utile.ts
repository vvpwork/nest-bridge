import shortHash from 'shorthash2';

export const getShortHash = (identityId: string, nftId: string) =>
  shortHash(`${identityId}:${nftId}`);
