// routes/libros.js
const router = require('express').Router();
const ctrl   = require('../controllers/librosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Público para usuarios autenticados
router.get('/',    verifyToken, ctrl.getAll);
router.get('/:id', verifyToken, ctrl.getById);

// Solo admin
router.post('/',    verifyToken, isAdmin, ctrl.create);
router.put('/:id',  verifyToken, isAdmin, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;
