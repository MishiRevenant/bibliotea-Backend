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
        { titulo: 'Cien Años de Soledad',   autor: 'Gabriel García Márquez', categoria: 'Literatura',   cantidad: 3, imagen: 'https://images.penguinrandomhouse.com/cover/9780307474728' },
        { titulo: 'El Principito',          autor: 'Antoine de Saint-Exupéry', categoria: 'Clásicos', cantidad: 5, imagen: 'https://images-na.ssl-images-amazon.com/images/I/71OZY035QkL.jpg' },
        { titulo: 'Clean Code',             autor: 'Robert C. Martin',        categoria: 'Tecnología',  cantidad: 2, imagen: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg' },
        { titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien',          categoria: 'Fantasía',    cantidad: 4, imagen: 'https://m.media-amazon.com/images/I/51EstVXM1UL._SX331_BO1,204,203,200_.jpg' },
        { titulo: 'Sapiens',                autor: 'Yuval Noah Harari',       categoria: 'Historia',    cantidad: 3, imagen: 'https://m.media-amazon.com/images/I/41yu2qXhXXL._SX324_BO1,204,203,200_.jpg' }
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
