# 📚 BiblioTech — Sistema Web de Gestión de Biblioteca

**Universidad Continental — Desarrollo de Aplicaciones Web**  
Producto Académico N.º 4

---

## 🗂 Estructura del proyecto

```
biblioteca/
├── config/
│   └── database.js          # Conexión Sequelize + MySQL
├── controllers/
│   ├── authController.js    # Registro y login (bcrypt + JWT)
│   ├── librosController.js  # CRUD libros + búsqueda
│   ├── prestamosController.js # Préstamos, aprobación y devoluciones
│   └── usuariosController.js  # CRUD usuarios (admin)
├── middleware/
│   └── auth.js              # verifyToken + isAdmin
├── models/
│   ├── index.js             # Carga modelos + asociaciones
│   ├── Usuario.js
│   ├── Libro.js
│   └── Prestamo.js
├── routes/
│   ├── auth.js
│   ├── libros.js
│   ├── prestamos.js
│   └── usuarios.js
├── public/                  # Frontend estático
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── database.sql             # Script SQL completo
├── .env.example             # Variables de entorno
├── package.json
└── server.js                # Servidor principal
```

---

## ⚙️ Instalación y configuración

### 1. Requisitos previos
- Node.js v18+
- MySQL 8+
- npm

### 2. Clonar / abrir el proyecto en VS Code
```bash
cd biblioteca
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

### 5. Crear la base de datos
```sql
-- Ejecutar database.sql en MySQL Workbench o terminal:
mysql -u root -p < database.sql
```

### 6. Arrancar el servidor
```bash
# Producción
npm start

# Desarrollo (auto-reload)
npm run dev
```

### 7. Abrir en el navegador
```
http://localhost:3000
```

---

## 🔗 Endpoints de la API REST

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión | Público |
| GET | `/libros` | Listar libros (+ ?titulo=xyz) | Autenticado |
| GET | `/libros/:id` | Ver libro | Autenticado |
| POST | `/libros` | Crear libro | Admin |
| PUT | `/libros/:id` | Editar libro | Admin |
| DELETE | `/libros/:id` | Eliminar libro | Admin |
| POST | `/prestamos` | Solicitar préstamo | Usuario |
| GET | `/prestamos` | Ver préstamos (filtrado por rol) | Autenticado |
| PUT | `/prestamos/:id/aprobar` | Aprobar préstamo | Admin |
| PUT | `/prestamos/:id/devolver` | Registrar devolución | Admin |
| GET | `/usuarios` | Listar usuarios | Admin |
| GET | `/usuarios/:id` | Ver usuario | Admin |
| PUT | `/usuarios/:id` | Editar usuario | Admin |
| DELETE | `/usuarios/:id` | Eliminar usuario | Admin |

---

## 🔐 Seguridad implementada

- **bcrypt** (salt rounds: 10) para almacenar contraseñas
- **JWT** para autenticación sin estado (expira en 8h)
- Middleware `verifyToken` protege rutas privadas
- Middleware `isAdmin` restringe rutas de administrador
- Contraseñas nunca se devuelven en respuestas

---

## 🧩 Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| Node.js | Entorno de ejecución |
| Express | Framework HTTP |
| Sequelize | ORM para MySQL |
| MySQL | Base de datos relacional |
| bcrypt | Hash de contraseñas |
| jsonwebtoken | Autenticación JWT |
| crypto | Generación de códigos únicos |
| HTML/CSS/JS | Frontend SPA |

---

## 👤 Credenciales de prueba

Después de ejecutar el script SQL y reemplazar el hash en la tabla,
o registrarte vía `/auth/register`, usa:

```
Admin:   admin@biblioteca.com  /  admin123
```
*(El hash bcrypt se genera al registrar, o usa la ruta de seed en database.sql)*
