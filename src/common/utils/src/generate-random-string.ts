import { randomBytes } from 'crypto';

export const generateRandomString = (length: number = 32): string => {
  return randomBytes(length).toString('base64').slice(0, length);
};
