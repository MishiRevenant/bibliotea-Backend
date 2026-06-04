// routes/prestamos.js
const router = require('express').Router();
const ctrl   = require('../controllers/prestamosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Autenticado: solicitar y ver sus préstamos
router.post('/',  verifyToken, ctrl.solicitar);
router.get('/',   verifyToken, ctrl.getAll);

// Admin: aprobar y registrar devolución
router.put('/:id/aprobar',  verifyToken, isAdmin, ctrl.aprobar);
router.put('/:id/devolver', verifyToken, ctrl.devolver);   // admin o el mismo usuario

module.exports = router;
