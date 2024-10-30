import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
  },
  refreshToken: {
    ttl: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME),
  },
  emailVerificationToken: {
    ttl: parseInt(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME),
  },
}));
