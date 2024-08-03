module.exports = (sequelize, DataTypes) => {
  const Diagram = sequelize.define("Diagram", {
    name: DataTypes.STRING,
    xmiData: DataTypes.TEXT, // stores the XMI data
  });

  return Diagram;
};
