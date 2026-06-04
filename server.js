// server.js — Punto de entrada principal
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { sequelize } = require('./models');
const swaggerDocs = require('./config/swagger');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// ── Documentación Swagger ─────────────────────────────────
swaggerDocs(app);

// ── Rutas API ─────────────────────────────────────────────
app.use('/auth',      require('./routes/auth'));
app.use('/libros',    require('./routes/libros'));
app.use('/prestamos', require('./routes/prestamos'));
app.use('/usuarios',  require('./routes/usuarios'));

// ── SPA fallback (sirve index.html para rutas del frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Manejo de errores global ──────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// ── Conexión a BD y arranque ──────────────────────────────
sequelize
  .authenticate()
  .then(() => {
    console.log('✅  Conexión a PostgreSQL establecida correctamente.');
    // sync({ alter: true }) actualiza tablas sin borrar datos
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀  Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  });

// Exportar la aplicación para entornos Serverless (ej. Vercel)
module.exports = app;
