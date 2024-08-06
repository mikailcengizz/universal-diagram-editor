"use strict";

import { Sequelize } from 'sequelize';
import { initDiagram, Diagram } from './Diagram';
import { initUser, User } from './User';
import config from '../config/config.json'; // Adjust the path as necessary

const sequelize = new Sequelize(config);

const db = {
  sequelize,
  Sequelize,
  Diagram: initDiagram(sequelize),
  User: initUser(sequelize),
};

export type DbModels = typeof db;

export default db;

