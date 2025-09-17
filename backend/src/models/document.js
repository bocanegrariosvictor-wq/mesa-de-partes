const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Document', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tramiteNumber: { type: DataTypes.STRING, unique: true },
    remitente: { type: DataTypes.STRING, allowNull: false },
    destinatario: { type: DataTypes.STRING },
    asunto: { type: DataTypes.TEXT },
    tipo: { type: DataTypes.STRING },
    estado: { type: DataTypes.ENUM('Pendiente','En Proceso','Atendido','Archivada'), defaultValue: 'Pendiente' },
    archivoPath: { type: DataTypes.STRING }
  });
};
