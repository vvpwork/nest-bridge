import shortHash from 'shorthash2';

export const getShortHash = (firstText: string, secondText: string) => shortHash(`${firstText}:${secondText}`);
