/**
 * @swagger
 * components:
 *   schemas:
 *     Prestamo:
 *       type: object
 *       required:
 *         - usuario_id
 *         - libro_id
 *         - codigo
 *         - fecha_prestamo
 *       properties:
 *         id:
 *           type: integer
 *         usuario_id:
 *           type: integer
 *         libro_id:
 *           type: integer
 *         codigo:
 *           type: string
 *         fecha_prestamo:
 *           type: string
 *           format: date
 *         fecha_devolucion:
 *           type: string
 *           format: date
 *         estado:
 *           type: string
 *           enum: [pendiente, prestado, devuelto]
 *       example:
 *         id: 1
 *         usuario_id: 2
 *         libro_id: 5
 *         codigo: "PR-ABC12"
 *         fecha_prestamo: "2024-05-20"
 *         fecha_devolucion: null
 *         estado: "prestado"
 */
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
