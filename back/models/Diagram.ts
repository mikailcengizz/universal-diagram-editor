import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface DiagramAttributes {
  id?: number;
  name: string;
  xmiData: string;
}

interface DiagramCreationAttributes extends Optional<DiagramAttributes, 'id'> {}

class Diagram extends Model<DiagramAttributes, DiagramCreationAttributes> implements DiagramAttributes {
  public id!: number;
  public name!: string;
  public xmiData!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initDiagram = (sequelize: Sequelize) => {
  Diagram.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      xmiData: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Diagrams',
    }
  );

  return Diagram;
};
