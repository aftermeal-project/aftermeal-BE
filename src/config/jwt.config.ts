import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  tokenExpired: process.env.TOKEN_EXPIRE_TIME,
}));
