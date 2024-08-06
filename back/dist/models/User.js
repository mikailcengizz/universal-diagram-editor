"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUser = void 0;
const sequelize_1 = require("sequelize");
// Define the User class, extending Sequelize's Model
class User extends sequelize_1.Model {
    static associate(models) {
        // define association here
    }
}
// Initialization function
const initUser = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        firstname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        profilePic: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'Users',
    });
    return User;
};
exports.initUser = initUser;
