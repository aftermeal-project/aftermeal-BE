import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  sender: {
    name: process.env.EMAIL_SENDER_NAME,
    address: process.env.EMAIL_SENDER_ADDRESS,
  },
}));
