import { randomBytes } from 'node:crypto';

export const generateRandomString = (length: number) => randomBytes(20).toString('hex').slice(0, length);
