import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  host: process.env.APP_HOST,
  port: parseInt(process.env.APP_PORT, 10),
}));
