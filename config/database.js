// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// HACK PARA VERCEL: Requerir pg explícitamente para que el bundler de Vercel lo incluya en la función Serverless
require('pg');
require('pg-hstore');

let sequelize;

if (process.env.DATABASE_URL) {
  // Conexión directa mediante URL (ej. Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Requerido para evitar problemas de certificado con Supabase
      }
    },
    define: {
      timestamps: true,      // createdAt / updatedAt automáticos
      underscored: false,
    },
  });
} else {
  // Conexión tradicional por parámetros
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        // Descomenta el SSL si es necesario para tu Postgres local
        /*
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
        */
      },
      define: {
        timestamps: true,      // createdAt / updatedAt automáticos
        underscored: false,
      },
    }
  );
}

module.exports = sequelize;
