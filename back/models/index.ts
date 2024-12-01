"use strict";

import { Sequelize, Dialect } from 'sequelize';
import { initDiagram } from './Diagram';
import { initUser } from './User';
import config from '../config/config.json'; 

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env as keyof typeof config];

const sequelizeConfig: {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
} = {
  ...envConfig,
  dialect: envConfig.dialect as Dialect, 
};

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password ?? undefined,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
  }
);

const db = {
  sequelize,
  Sequelize,
  Diagram: initDiagram(sequelize),
  User: initUser(sequelize),
};

export type DbModels = typeof db;

export default db;

