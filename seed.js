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
        { titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', categoria: 'Literatura', cantidad: 3, imagen: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjE3CPA_tuzhpPyTsBbLmmcHgVNmd62pMdRurl9jJDZcbrvbgdvqe3on1Lz0RO5zpLbguKh175MFA5H3vg-hicK3oxaftaYECyuwfF4-TT7J-BOueoxGhAf9DvzrFe0aIOS88nIcR6xEeRo7qzo4DMNQXIuEKlemMu3QDe1aoytIN9Zno3wNYJlJHaSCOU/s606/078-Cien%20a%C3%B1os%20de%20soledad-Gabriel%20Garc%C3%ADa%20M%C3%A1rquez.jpg' },
        { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', categoria: 'Clásicos', cantidad: 5, imagen: 'https://www.penguinlibros.com/pe/7401363-large_default/el-principito-edicion-original.webp' },
        { titulo: 'Clean Code', autor: 'Robert C. Martin', categoria: 'Tecnología', cantidad: 2, imagen: 'https://images.cdn3.buscalibre.com/fit-in/360x360/10/fb/10fb170d7732b7dca25ebb81ded2572d.jpg' },
        { titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien', categoria: 'Fantasía', cantidad: 4, imagen: 'https://images.cdn3.buscalibre.com/fit-in/360x360/db/09/db099c3235b90492cd39b8c59f32a7b5.jpg' },
        { titulo: 'Sapiens', autor: 'Yuval Noah Harari', categoria: 'Historia', cantidad: 3, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyAJxSA62_Z8k-pqxGp8x3Zp1bWoAtBjkZow&s' }
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
