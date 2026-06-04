// models/Prestamo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prestamo = sequelize.define('Prestamo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  libro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  fecha_prestamo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_devolucion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'prestado', 'devuelto'),
    defaultValue: 'pendiente',
  },
}, {
  tableName: 'prestamos',
});

module.exports = Prestamo;
