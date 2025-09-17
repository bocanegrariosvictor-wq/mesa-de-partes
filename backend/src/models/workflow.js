const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Workflow', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentId: { type: DataTypes.INTEGER, allowNull: false },
    fromRole: { type: DataTypes.STRING },
    toRole: { type: DataTypes.STRING },
    note: { type: DataTypes.TEXT },
    action: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.INTEGER }
  });
};
