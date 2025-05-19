import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'athlete_platform',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'mysecretpassword',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: false,
});

export default sequelize;