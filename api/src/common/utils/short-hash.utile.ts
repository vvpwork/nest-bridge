import shortHash from 'shorthash2';

/**
 *
 * @param firstText - identityId
 * @param secondText - nftId
 * @returns
 */
export const getShortHash = (firstText: string, secondText: string) => shortHash(`${firstText}:${secondText}`);
