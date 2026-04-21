/* ═══════════════════════════════════════════════════
   nav.js — Navegación entre pestañas y hamburger menu
   ═══════════════════════════════════════════════════ */

/**
 * Navega a la página indicada. Solo muestra la pestaña si está habilitada
 * según la configuración actual (pública o docente).
 * @param {string} id - ID de la página (sin prefijo 'page-')
 */
function showPage(id) {
  const page = document.getElementById('page-' + id);
  if (!page) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  page.classList.add('active');

  const navLink = document.getElementById('nav-' + id);
  if (navLink) navLink.classList.add('active');

  window.scrollTo(0, 0);
}

/* ── HAMBURGER ── */
function toggleNav() {
  const list = document.getElementById('nav-links-list');
  const btn  = document.getElementById('nav-toggle');
  const open = list.classList.toggle('open');
  btn.textContent = open ? '✕' : '☰';
}

function closeNav() {
  const list = document.getElementById('nav-links-list');
  const btn  = document.getElementById('nav-toggle');
  list.classList.remove('open');
  btn.textContent = '☰';
}
