import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10),
  baseUrl: process.env.BASE_URL,
}));
