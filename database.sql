-- ============================================
-- SISTEMA WEB DE GESTIÓN DE BIBLIOTECA
-- Script SQL - Base de Datos
-- ============================================

CREATE DATABASE IF NOT EXISTS biblioteca_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE biblioteca_db;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  email    VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol      ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: libros
-- ============================================
CREATE TABLE IF NOT EXISTS libros (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  titulo    VARCHAR(200) NOT NULL,
  autor     VARCHAR(150) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  cantidad  INT NOT NULL DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: prestamos
-- ============================================
CREATE TABLE IF NOT EXISTS prestamos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id       INT NOT NULL,
  libro_id         INT NOT NULL,
  codigo           VARCHAR(20) NOT NULL UNIQUE,
  fecha_prestamo   DATE NOT NULL,
  fecha_devolucion DATE DEFAULT NULL,
  estado           ENUM('pendiente', 'prestado', 'devuelto') NOT NULL DEFAULT 'pendiente',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (libro_id)   REFERENCES libros(id)   ON DELETE CASCADE
);

-- ============================================
-- DATOS INICIALES (Seed)
-- ============================================

-- Admin por defecto  (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@biblioteca.com',
 '$2b$10$YourHashHere_ReplaceWithRealBcryptHash', 'admin');

-- Libros de ejemplo
INSERT INTO libros (titulo, autor, categoria, cantidad) VALUES
('Cien Años de Soledad',   'Gabriel García Márquez', 'Literatura',   3),
('El Principito',          'Antoine de Saint-Exupéry','Clásicos',    5),
('Clean Code',             'Robert C. Martin',        'Tecnología',  2),
('El Señor de los Anillos','J.R.R. Tolkien',          'Fantasía',    4),
('Sapiens',                'Yuval Noah Harari',       'Historia',    3);
