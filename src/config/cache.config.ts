import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  invitation: {
    ttl: parseInt(process.env.CACHE_INVITATION_TTL),
  },
}));
