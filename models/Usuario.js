/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         rol:
 *           type: string
 *           enum: [admin, usuario]
 *       example:
 *         id: 1
 *         nombre: "Juan Perez"
 *         email: "juan@example.com"
 *         rol: "usuario"
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'usuario'),
    defaultValue: 'usuario',
  },
}, {
  tableName: 'usuarios',
});

module.exports = Usuario;
