import dotenv from 'dotenv';
dotenv.config();

const config = {

  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL || 'http://localhost:8080',
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES || '1d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'cookieToken',
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com',
  MAIL_PORT: Number(process.env.MAIL_PORT || 587),
  MAIL_SECURE: String(process.env.MAIL_SECURE || 'false') === 'true',
  MAIL_USER: process.env.MAIL_USER || null,
  MAIL_PASS: process.env.MAIL_PASS || null,
  MAIL_FROM: process.env.MAIL_FROM || 'Ecommerce <no-reply@ecommerce.local>',
};

export default config;
