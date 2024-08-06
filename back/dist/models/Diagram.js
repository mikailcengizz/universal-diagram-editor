"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDiagram = void 0;
const sequelize_1 = require("sequelize");
// Define the Diagram class, extending Sequelize's Model
class Diagram extends sequelize_1.Model {
}
// Initialization function
const initDiagram = (sequelize) => {
    Diagram.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        xmiData: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'Diagrams',
    });
    return Diagram;
};
exports.initDiagram = initDiagram;
