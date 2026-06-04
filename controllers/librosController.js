// controllers/librosController.js
const { Op } = require('sequelize');
const { Libro } = require('../models');

// GET /libros  (con búsqueda opcional: ?titulo=xyz)
const getAll = async (req, res) => {
  try {
    const { titulo } = req.query;
    const where = titulo
      ? { titulo: { [Op.like]: `%${titulo}%` } }
      : {};

    const libros = await Libro.findAll({ where, order: [['titulo', 'ASC']] });
    return res.json(libros);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener libros.' });
  }
};

// GET /libros/:id
const getById = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado.' });
    return res.json(libro);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener libro.' });
  }
};

// POST /libros  (admin)
const create = async (req, res) => {
  try {
    const { titulo, autor, categoria, cantidad, imagen } = req.body;
    if (!titulo || !autor || !categoria) {
      return res.status(400).json({ message: 'Título, autor y categoría son obligatorios.' });
    }
    const libro = await Libro.create({ titulo, autor, categoria, cantidad: cantidad ?? 1, imagen });
    return res.status(201).json({ message: 'Libro creado exitosamente.', libro });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear libro.' });
  }
};

// PUT /libros/:id  (admin)
const update = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado.' });

    await libro.update(req.body);
    return res.json({ message: 'Libro actualizado.', libro });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar libro.' });
  }
};

// DELETE /libros/:id  (admin)
const remove = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado.' });
    await libro.destroy();
    return res.json({ message: 'Libro eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar libro.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
