// routes/usuarios.js
const router = require('express').Router();
const ctrl   = require('../controllers/usuariosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/',     verifyToken, isAdmin, ctrl.getAll);
router.get('/:id',  verifyToken, isAdmin, ctrl.getById);
router.put('/:id',  verifyToken, isAdmin, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;
