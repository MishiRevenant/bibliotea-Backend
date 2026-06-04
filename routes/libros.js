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
 */
// Público para usuarios autenticados
router.get('/',    verifyToken, ctrl.getAll);
router.get('/:id', verifyToken, ctrl.getById);

// Solo admin
router.post('/',    verifyToken, isAdmin, ctrl.create);
router.put('/:id',  verifyToken, isAdmin, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;
