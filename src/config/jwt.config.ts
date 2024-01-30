import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY_TIME),
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY_TIME),
  },
  issuer: process.env.JWT_ISSUER,
}));
