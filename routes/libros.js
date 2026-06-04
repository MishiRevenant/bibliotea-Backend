// routes/libros.js
const router = require('express').Router();
const ctrl   = require('../controllers/librosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Libros
 *   description: Gestión de libros
 */

/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Obtiene la lista de todos los libros
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
router.get('/',    verifyToken, ctrl.getAll);

/**
 * @swagger
 * /libros/{id}:
 *   get:
 *     summary: Obtiene un libro por su ID
 *     tags: [Libros]
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
 *         description: Datos del libro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 */
router.get('/:id', verifyToken, ctrl.getById);

/**
 * @swagger
 * /libros:
 *   post:
 *     summary: Crear un nuevo libro (Solo Admin)
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       201:
 *         description: Libro creado exitosamente
 */
router.post('/',    verifyToken, isAdmin, ctrl.create);

/**
 * @swagger
 * /libros/{id}:
 *   put:
 *     summary: Actualizar un libro (Solo Admin)
 *     tags: [Libros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente
 */
router.put('/:id',  verifyToken, isAdmin, ctrl.update);

/**
 * @swagger
 * /libros/{id}:
 *   delete:
 *     summary: Eliminar un libro (Solo Admin)
 *     tags: [Libros]
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
 *         description: Libro eliminado
 */
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;
