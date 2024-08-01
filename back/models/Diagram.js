// Example Sequelize model for storing diagrams
module.exports = (sequelize, DataTypes) => {
  const Diagram = sequelize.define("Diagram", {
    name: DataTypes.STRING,
    xmiData: DataTypes.TEXT, // Stores the XMI data
  });

  return Diagram;
};
