// routes/prestamos.js
const router = require('express').Router();
const ctrl   = require('../controllers/prestamosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Prestamos
 *   description: Gestión de préstamos
 */

/**
 * @swagger
 * /prestamos:
 *   post:
 *     summary: Solicitar un préstamo
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libro_id
 *             properties:
 *               libro_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Préstamo solicitado
 */
router.post('/',  verifyToken, ctrl.solicitar);

/**
 * @swagger
 * /prestamos:
 *   get:
 *     summary: Obtener todos los préstamos (usuario actual o todos si es admin)
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestamo'
 */
router.get('/',   verifyToken, ctrl.getAll);

/**
 * @swagger
 * /prestamos/{id}/aprobar:
 *   put:
 *     summary: Aprobar un préstamo (Solo Admin)
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Préstamo aprobado
 */
router.put('/:id/aprobar',  verifyToken, isAdmin, ctrl.aprobar);

/**
 * @swagger
 * /prestamos/{id}/devolver:
 *   put:
 *     summary: Devolver un libro
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro devuelto
 */
router.put('/:id/devolver', verifyToken, ctrl.devolver);

module.exports = router;
