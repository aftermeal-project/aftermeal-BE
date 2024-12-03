import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT, 10),
}));
