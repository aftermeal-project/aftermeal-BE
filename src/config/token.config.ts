import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY_TIME),
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY_TIME),
  },
  invitationToken: {
    ttl: parseInt(process.env.INVITATION_TOKEN_TTL),
  },
}));
