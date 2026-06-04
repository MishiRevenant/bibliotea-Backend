// controllers/prestamosController.js
const crypto = require('crypto');
const { Prestamo, Libro, Usuario } = require('../models');

// Genera código único tipo A7F3C91D
const generarCodigo = () =>
  crypto.randomBytes(4).toString('hex').toUpperCase();

// ── POST /prestamos — solicitar préstamo ─────────────────
const solicitar = async (req, res) => {
  try {
    const { libro_id } = req.body;
    const usuario_id = req.usuario.id; // viene del JWT

    if (!libro_id) {
      return res.status(400).json({ message: 'El ID del libro es obligatorio.' });
    }

    const libro = await Libro.findByPk(libro_id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado.' });
    if (libro.cantidad < 1) {
      return res.status(400).json({ message: 'No hay ejemplares disponibles.' });
    }

    // Verificar que el usuario no tenga ya ese libro prestado
    const yaExiste = await Prestamo.findOne({
      where: { usuario_id, libro_id, estado: ['pendiente', 'prestado'] },
    });
    if (yaExiste) {
      return res.status(409).json({ message: 'Ya tienes un préstamo activo para este libro.' });
    }

    const codigo = generarCodigo();
    const prestamo = await Prestamo.create({
      usuario_id,
      libro_id,
      codigo,
      fecha_prestamo: new Date(),
      estado: 'pendiente',
    });

    // Reducir cantidad disponible
    await libro.update({ cantidad: libro.cantidad - 1 });

    return res.status(201).json({ message: 'Préstamo solicitado exitosamente.', prestamo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al solicitar préstamo.' });
  }
};

// ── GET /prestamos — listar préstamos ────────────────────
// Admin: todos | Usuario: solo los suyos
const getAll = async (req, res) => {
  try {
    const where = req.usuario.rol === 'admin' ? {} : { usuario_id: req.usuario.id };

    const prestamos = await Prestamo.findAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { model: Libro,   as: 'libro',   attributes: ['id', 'titulo', 'autor'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(prestamos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener préstamos.' });
  }
};

// ── PUT /prestamos/:id/aprobar — aprobar préstamo (admin) ─
const aprobar = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id);
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado.' });
    if (prestamo.estado !== 'pendiente') {
      return res.status(400).json({ message: 'Solo se pueden aprobar préstamos pendientes.' });
    }

    await prestamo.update({ estado: 'prestado' });
    return res.json({ message: 'Préstamo aprobado.', prestamo });
  } catch (error) {
    return res.status(500).json({ message: 'Error al aprobar préstamo.' });
  }
};

// ── PUT /prestamos/:id/devolver — registrar devolución ───
const devolver = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id, {
      include: [{ model: Libro, as: 'libro' }],
    });
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado.' });
    if (prestamo.estado === 'devuelto') {
      return res.status(400).json({ message: 'Este préstamo ya fue devuelto.' });
    }

    await prestamo.update({
      estado: 'devuelto',
      fecha_devolucion: new Date(),
    });

    // Devolver unidad al inventario
    await prestamo.libro.update({ cantidad: prestamo.libro.cantidad + 1 });

    return res.json({ message: 'Devolución registrada correctamente.', prestamo });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar devolución.' });
  }
};

module.exports = { solicitar, getAll, aprobar, devolver };
