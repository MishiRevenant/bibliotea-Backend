/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *         - categoria
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del libro
 *         titulo:
 *           type: string
 *           description: Título del libro
 *         autor:
 *           type: string
 *           description: Autor del libro
 *         categoria:
 *           type: string
 *           description: Categoría del libro
 *         cantidad:
 *           type: integer
 *           description: Cantidad de ejemplares disponibles
 *       example:
 *         id: 1
 *         titulo: "Clean Code"
 *         autor: "Robert C. Martin"
 *         categoria: "Tecnología"
 *         cantidad: 2
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Libro = sequelize.define('Libro', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { notEmpty: true },
  },
  autor: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 0 },
  },
}, {
  tableName: 'libros',
});

module.exports = Libro;
