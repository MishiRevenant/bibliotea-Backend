// public/js/app.js — Lógica completa del frontend
'use strict';

const API = '';   // mismo origen; en dev cambiar a 'http://localhost:3000'

// ── Estado global ─────────────────────────────────────────
let token    = localStorage.getItem('token') || null;
let usuario  = JSON.parse(localStorage.getItem('usuario') || 'null');
let libros   = [];   // cache catálogo

// ── Utilidades ────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showToast(msg, type = 'ok') {
  const t = $('toast');
  t.textContent = msg;
  t.className   = `toast show ${type}`;
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error en la solicitud.');
  return data;
}

function openModal(id)  { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }

// ── Navegación ────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const page = $(`page-${name}`);
  if (page) page.classList.add('active');

  const link = document.querySelector(`[data-page="${name}"]`);
  if (link) link.classList.add('active');

  // Cargar datos al cambiar de página
  if (name === 'catalogo')         loadCatalogo();
  if (name === 'mis-prestamos')    loadMisPrestamos();
  if (name === 'admin-libros')     loadAdminLibros();
  if (name === 'admin-prestamos')  loadAdminPrestamos();
  if (name === 'admin-usuarios')   loadAdminUsuarios();
}

// ── Eventos nav-links ─────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// ── Sesión ────────────────────────────────────────────────
function applySession() {
  if (!usuario) return;

  $('userBadge').textContent = `${usuario.nombre} · ${usuario.rol}`;
  $('userBadge').style.display = '';
  $('btnAuth').textContent = 'Cerrar Sesión';
  $('btnAuth').onclick = doLogout;
  $('navMisPrestamos').style.display = '';

  if (usuario.rol === 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = '');
  }

  showPage('catalogo');
}

function doLogout() {
  token = null; usuario = null;
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  $('userBadge').style.display = 'none';
  $('btnAuth').textContent = 'Iniciar Sesión';
  $('btnAuth').onclick = () => showPage('login');
  $('navMisPrestamos').style.display = 'none';
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  showPage('login');
}

// ── AUTH: Login ───────────────────────────────────────────
async function doLogin() {
  const email    = $('loginEmail').value.trim();
  const password = $('loginPassword').value;
  const errEl    = $('loginError');
  errEl.style.display = 'none';

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    token   = data.token;
    usuario = data.usuario;
    localStorage.setItem('token',   token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    showToast(`Bienvenido, ${usuario.nombre} 👋`);
    applySession();
  } catch (err) {
    errEl.textContent    = err.message;
    errEl.style.display  = '';
  }
}

// ── AUTH: Registro ────────────────────────────────────────
async function doRegister() {
  const nombre   = $('regNombre').value.trim();
  const email    = $('regEmail').value.trim();
  const password = $('regPassword').value;
  const errEl    = $('regError');
  const okEl     = $('regOk');
  errEl.style.display = 'none';
  okEl.style.display  = 'none';

  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });
    okEl.textContent   = '¡Cuenta creada! Ahora puedes iniciar sesión.';
    okEl.style.display = '';
    setTimeout(() => showPage('login'), 1800);
  } catch (err) {
    errEl.textContent   = err.message;
    errEl.style.display = '';
  }
}

// ── CATÁLOGO ──────────────────────────────────────────────
async function loadCatalogo() {
  $('booksGrid').innerHTML = '<div class="loading">Cargando libros…</div>';
  try {
    libros = await apiFetch('/libros');
    renderBooks(libros);
  } catch {
    $('booksGrid').innerHTML = '<div class="loading">Error al cargar catálogo.</div>';
  }
}

function buscarLibros() {
  const q = $('searchInput').value.toLowerCase().trim();
  const filtrados = q ? libros.filter(l => l.titulo.toLowerCase().includes(q)) : libros;
  renderBooks(filtrados);
}

function renderBooks(lista) {
  if (!lista.length) {
    $('booksGrid').innerHTML = '<div class="loading">No se encontraron libros.</div>';
    return;
  }
  $('booksGrid').innerHTML = lista.map(l => `
    <div class="book-card">
      <div class="book-cat">${l.categoria}</div>
      <div class="book-title">${l.titulo}</div>
      <div class="book-author">${l.autor}</div>
      <div class="book-stock ${l.cantidad < 1 ? 'agotado' : ''}">
        Disponibles: <span>${l.cantidad}</span>
      </div>
      ${usuario && usuario.rol === 'usuario' && l.cantidad > 0
        ? `<button class="btn-sm" onclick="solicitarPrestamo(${l.id})">Solicitar préstamo</button>`
        : usuario && l.cantidad < 1 ? '<span style="font-size:.8rem;color:var(--error)">Sin stock</span>' : ''}
    </div>
  `).join('');
}

// ── SOLICITAR PRÉSTAMO ────────────────────────────────────
async function solicitarPrestamo(libroId) {
  if (!token) { showPage('login'); return; }
  try {
    await apiFetch('/prestamos', {
      method: 'POST',
      body: JSON.stringify({ libro_id: libroId }),
    });
    showToast('Préstamo solicitado. Espera aprobación del administrador.');
    loadCatalogo();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── MIS PRÉSTAMOS (usuario) ───────────────────────────────
async function loadMisPrestamos() {
  $('misPrestamosContainer').innerHTML = '<div class="loading">Cargando…</div>';
  try {
    const data = await apiFetch('/prestamos');
    if (!data.length) {
      $('misPrestamosContainer').innerHTML = '<div class="loading">No tienes préstamos registrados.</div>';
      return;
    }
    $('misPrestamosContainer').innerHTML = `
      <table>
        <thead><tr>
          <th>Código</th><th>Libro</th><th>Fecha</th><th>Estado</th>
        </tr></thead>
        <tbody>
          ${data.map(p => `
            <tr>
              <td><code>${p.codigo}</code></td>
              <td>${p.libro?.titulo || '—'}</td>
              <td>${p.fecha_prestamo}</td>
              <td>${badgePrestamo(p.estado)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch {
    $('misPrestamosContainer').innerHTML = '<div class="loading">Error al cargar.</div>';
  }
}

// ── ADMIN: LIBROS ─────────────────────────────────────────
async function loadAdminLibros() {
  $('adminLibrosContainer').innerHTML = '<div class="loading">Cargando…</div>';
  try {
    const data = await apiFetch('/libros');
    $('adminLibrosContainer').innerHTML = `
      <table>
        <thead><tr>
          <th>ID</th><th>Título</th><th>Autor</th><th>Categoría</th><th>Stock</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${data.map(l => `
            <tr>
              <td>${l.id}</td>
              <td>${l.titulo}</td>
              <td>${l.autor}</td>
              <td>${l.categoria}</td>
              <td>${l.cantidad}</td>
              <td>
                <button class="btn-sm" onclick="editarLibro(${l.id})">Editar</button>
                <button class="btn-sm danger" onclick="eliminarLibro(${l.id})">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch {
    $('adminLibrosContainer').innerHTML = '<div class="loading">Error al cargar.</div>';
  }
}

function openNuevoLibro() {
  $('modalLibroTitle').textContent = 'Nuevo Libro';
  $('libroId').value = '';
  $('libroTitulo').value = '';
  $('libroAutor').value  = '';
  $('libroCategoria').value = '';
  $('libroCantidad').value  = 1;
  openModal('modalLibro');
}

async function editarLibro(id) {
  try {
    const l = await apiFetch(`/libros/${id}`);
    $('modalLibroTitle').textContent = 'Editar Libro';
    $('libroId').value       = l.id;
    $('libroTitulo').value   = l.titulo;
    $('libroAutor').value    = l.autor;
    $('libroCategoria').value= l.categoria;
    $('libroCantidad').value = l.cantidad;
    openModal('modalLibro');
  } catch (err) { showToast(err.message, 'error'); }
}

async function guardarLibro() {
  const id       = $('libroId').value;
  const titulo   = $('libroTitulo').value.trim();
  const autor    = $('libroAutor').value.trim();
  const categoria= $('libroCategoria').value.trim();
  const cantidad = parseInt($('libroCantidad').value) || 1;
  const errEl    = $('libroError');
  errEl.style.display = 'none';

  try {
    if (id) {
      await apiFetch(`/libros/${id}`, { method: 'PUT', body: JSON.stringify({ titulo, autor, categoria, cantidad }) });
      showToast('Libro actualizado correctamente.');
    } else {
      await apiFetch('/libros', { method: 'POST', body: JSON.stringify({ titulo, autor, categoria, cantidad }) });
      showToast('Libro creado correctamente.');
    }
    closeModal('modalLibro');
    loadAdminLibros();
  } catch (err) {
    errEl.textContent   = err.message;
    errEl.style.display = '';
  }
}

async function eliminarLibro(id) {
  if (!confirm('¿Eliminar este libro?')) return;
  try {
    await apiFetch(`/libros/${id}`, { method: 'DELETE' });
    showToast('Libro eliminado.');
    loadAdminLibros();
  } catch (err) { showToast(err.message, 'error'); }
}

// ── ADMIN: PRÉSTAMOS ──────────────────────────────────────
async function loadAdminPrestamos() {
  $('adminPrestamosContainer').innerHTML = '<div class="loading">Cargando…</div>';
  try {
    const data = await apiFetch('/prestamos');
    $('adminPrestamosContainer').innerHTML = `
      <table>
        <thead><tr>
          <th>Código</th><th>Usuario</th><th>Libro</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${data.map(p => `
            <tr>
              <td><code>${p.codigo}</code></td>
              <td>${p.usuario?.nombre || '—'}</td>
              <td>${p.libro?.titulo || '—'}</td>
              <td>${p.fecha_prestamo}</td>
              <td>${badgePrestamo(p.estado)}</td>
              <td>
                ${p.estado === 'pendiente'
                  ? `<button class="btn-sm approve" onclick="aprobarPrestamo(${p.id})">Aprobar</button>`
                  : ''}
                ${p.estado === 'prestado'
                  ? `<button class="btn-sm" onclick="devolverPrestamo(${p.id})">Devolver</button>`
                  : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch {
    $('adminPrestamosContainer').innerHTML = '<div class="loading">Error al cargar.</div>';
  }
}

async function aprobarPrestamo(id) {
  try {
    await apiFetch(`/prestamos/${id}/aprobar`, { method: 'PUT' });
    showToast('Préstamo aprobado.');
    loadAdminPrestamos();
  } catch (err) { showToast(err.message, 'error'); }
}

async function devolverPrestamo(id) {
  try {
    await apiFetch(`/prestamos/${id}/devolver`, { method: 'PUT' });
    showToast('Devolución registrada.');
    loadAdminPrestamos();
  } catch (err) { showToast(err.message, 'error'); }
}

// ── ADMIN: USUARIOS ───────────────────────────────────────
async function loadAdminUsuarios() {
  $('adminUsuariosContainer').innerHTML = '<div class="loading">Cargando…</div>';
  try {
    const data = await apiFetch('/usuarios');
    $('adminUsuariosContainer').innerHTML = `
      <table>
        <thead><tr>
          <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registrado</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          ${data.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.nombre}</td>
              <td>${u.email}</td>
              <td>${u.rol === 'admin' ? '<span class="badge badge-admin">Admin</span>' : '<span class="badge badge-user">Usuario</span>'}</td>
              <td>${new Date(u.createdAt).toLocaleDateString('es-PE')}</td>
              <td>
                ${u.id !== usuario?.id
                  ? `<button class="btn-sm danger" onclick="eliminarUsuario(${u.id})">Eliminar</button>`
                  : '<span style="font-size:.75rem;color:var(--text-muted)">Tú</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch {
    $('adminUsuariosContainer').innerHTML = '<div class="loading">Error al cargar.</div>';
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  try {
    await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
    showToast('Usuario eliminado.');
    loadAdminUsuarios();
  } catch (err) { showToast(err.message, 'error'); }
}

// ── HELPERS ───────────────────────────────────────────────
function badgePrestamo(estado) {
  const map = {
    pendiente: ['badge-pending',  'Pendiente'],
    prestado:  ['badge-active',   'Prestado'],
    devuelto:  ['badge-returned', 'Devuelto'],
  };
  const [cls, label] = map[estado] || ['', estado];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ── ARRANQUE ──────────────────────────────────────────────
(function init() {
  if (usuario && token) {
    applySession();
  } else {
    showPage('login');
  }
  // Botón nuevo libro desde el header de admin
  $('btnAuth').onclick = () => showPage('login');
})();
