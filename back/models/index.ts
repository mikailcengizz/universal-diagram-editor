"use strict";

import { Sequelize, Dialect } from 'sequelize';
import { initDiagram } from './Diagram';
import { initUser } from './User';
import config from '../config/config.json'; // Adjust the path as necessary

// Determine the current environment (development, test, production)
const env = process.env.NODE_ENV || 'development';
const envConfig = config[env as keyof typeof config];

// Define the config object with the correct types
const sequelizeConfig: {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
} = {
  ...envConfig,
  dialect: envConfig.dialect as Dialect, // Cast to Dialect type
};

// Initialize Sequelize with the selected configuration
const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password ?? undefined, // Handle null password case
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

