import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  user: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
}));
