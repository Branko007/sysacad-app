import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.pass,
  {
    host: env.db.host,
    dialect: 'postgres',
    port: env.db.port,
    logging: false,
  }
);

export default sequelize;
