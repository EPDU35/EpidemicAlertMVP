require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME || 'epidemic_alert',
  JWT_SECRET: process.env.JWT_SECRET || 'change_moi_en_prod',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
};
