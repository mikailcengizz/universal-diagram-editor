import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Define attributes
interface UserAttributes {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  profilePic?: string;
}

// Define creation attributes, all optional except required fields
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User class, extending Sequelize's Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public profilePic?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    // define association here
  }
}

// Initialization function
export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Users',
    }
  );

  return User;
};
