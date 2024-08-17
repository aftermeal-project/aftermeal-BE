import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
  },
  refreshToken: {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME),
  },
}));
