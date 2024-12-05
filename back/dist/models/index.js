"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Diagram_1 = require("./Diagram");
const User_1 = require("./User");
const config_json_1 = __importDefault(require("../config/config.json"));
const env = process.env.NODE_ENV || 'development';
const envConfig = config_json_1.default[env];
const sequelizeConfig = Object.assign(Object.assign({}, envConfig), { dialect: envConfig.dialect });
const sequelize = new sequelize_1.Sequelize(sequelizeConfig.database, sequelizeConfig.username, (_a = sequelizeConfig.password) !== null && _a !== void 0 ? _a : undefined, {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
});
const db = {
    sequelize,
    Sequelize: sequelize_1.Sequelize,
    Diagram: (0, Diagram_1.initDiagram)(sequelize),
    User: (0, User_1.initUser)(sequelize),
};
exports.default = db;
