// seed.js — Script de siembra de datos para la base de datos
const { sequelize, Usuario, Libro } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente para la siembra.');

    // Sincronizar tablas (las crea si no existen en PostgreSQL/Supabase)
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas en la base de datos.');

    // Crear el administrador por defecto
    const adminExiste = await Usuario.findOne({ where: { email: 'admin@biblioteca.com' } });
    if (!adminExiste) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@biblioteca.com',
        password: passwordHash,
        rol: 'admin'
      });
      console.log('👤 Usuario Administrador creado: admin@biblioteca.com / admin123');
    } else {
      console.log('ℹ️ El usuario administrador ya existe.');
    }

    // Crear libros de ejemplo
    const totalLibros = await Libro.count();
    if (totalLibros === 0) {
      await Libro.bulkCreate([
        { titulo: 'Cien Años de Soledad',   autor: 'Gabriel García Márquez', categoria: 'Literatura',   cantidad: 3 },
        { titulo: 'El Principito',          autor: 'Antoine de Saint-Exupéry', categoria: 'Clásicos',    5 },
        { titulo: 'Clean Code',             autor: 'Robert C. Martin',        categoria: 'Tecnología',  2 },
        { titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien',          categoria: 'Fantasía',    4 },
        { titulo: 'Sapiens',                autor: 'Yuval Noah Harari',       categoria: 'Historia',    3 }
      ]);
      console.log('📚 Libros de ejemplo creados exitosamente.');
    } else {
      console.log('ℹ️ Los libros de ejemplo ya existen.');
    }

    console.log('🎉 Siembra de datos finalizada con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar los datos:', error);
    process.exit(1);
  }
}

seed();
