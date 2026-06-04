// controllers/usuariosController.js
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

// GET /usuarios — listar todos (admin)
const getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    return res.json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};

// GET /usuarios/:id
const getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener usuario.' });
  }
};

// PUT /usuarios/:id — actualizar (admin)
const update = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { nombre, email, password, rol } = req.body;
    const datos = { nombre, email, rol };

    if (password) {
      datos.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(datos);
    const { password: _, ...resultado } = usuario.toJSON();
    return res.json({ message: 'Usuario actualizado.', usuario: resultado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar usuario.' });
  }
};

// DELETE /usuarios/:id — eliminar (admin)
const remove = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });
    await usuario.destroy();
    return res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
};

module.exports = { getAll, getById, update, remove };
