// models/index.js  — carga modelos y define asociaciones
const sequelize = require('../config/database');
const Usuario  = require('./Usuario');
const Libro    = require('./Libro');
const Prestamo = require('./Prestamo');

// ── Relaciones ────────────────────────────────────────────
Usuario.hasMany(Prestamo,  { foreignKey: 'usuario_id', as: 'prestamos' });
Libro.hasMany(Prestamo,    { foreignKey: 'libro_id',   as: 'prestamos' });
Prestamo.belongsTo(Usuario,{ foreignKey: 'usuario_id', as: 'usuario'   });
Prestamo.belongsTo(Libro,  { foreignKey: 'libro_id',   as: 'libro'     });

module.exports = { sequelize, Usuario, Libro, Prestamo };
