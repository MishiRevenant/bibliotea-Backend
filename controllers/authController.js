// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { Usuario } = require('../models');

// ── POST /auth/register ───────────────────────────────────
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios.' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const hash = await bcrypt.hash(password, 10);

    // Solo se permite asignar rol 'admin' si la petición viene de un admin
    // (en producción se protege la ruta; aquí se acepta 'usuario' por defecto)
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: rol === 'admin' ? 'admin' : 'usuario',
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
    });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// ── POST /auth/login ──────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { register, login };
