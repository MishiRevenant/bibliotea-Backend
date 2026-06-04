// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * verifyToken  — verifica que el request traiga un JWT válido.
 * Agrega req.usuario con { id, nombre, email, rol }.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token requerido. Acceso denegado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

/**
 * isAdmin  — debe usarse DESPUÉS de verifyToken.
 * Rechaza si el rol no es 'admin'.
 */
const isAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores.' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
