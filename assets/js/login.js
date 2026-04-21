/* ═══════════════════════════════════════════════════
   login.js — Autenticación docente y control de pestañas
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── CREDENCIALES HASHEADAS (SHA-256) ──────────────
   Usuario: docente
   Contraseña por defecto: docente2025
   El hash puede ser sobreescrito por el docente via
   la función "Cambiar contraseña" y se guarda en localStorage.
   ─────────────────────────────────────────────────── */
const AUTH = {
  user:        'docente',
  defaultHash: '74ee11d7051b6f6eafe1f45c7df7a2add616258621bf5839f47e73f9496c0eb5'
};
const PW_STORAGE_KEY = 'so_u2_pw_hash';

/** Devuelve el hash vigente (custom si existe, sino el default) */
function getCurrentHash() {
  return localStorage.getItem(PW_STORAGE_KEY) || AUTH.defaultHash;
}

/* ── PESTAÑAS CONFIGURABLES ─────────────────────────
   'inicio' está siempre visible y no es configurable.
   Las pestañas públicas (publicTabs) son visibles a todos.
   Las pestañas de docente (docenteTabs) solo cuando hay sesión activa.
   ─────────────────────────────────────────────────── */
const ALL_TABS = [
  { id: 'inicio',      label: 'Inicio',              locked: true  },
  { id: 'particiones', label: 'Particiones',          locked: false },
  { id: 'formateo',    label: 'Formateo',             locked: false },
  { id: 'archivos',    label: 'Sistemas de archivos', locked: false },
  { id: 'usuarios',    label: 'Casos de usuario',     locked: false, docenteOnly: true },
  { id: 'guia',        label: 'Guía de clase',        locked: false, docenteOnly: true },
];

const STORAGE_KEY = 'so_u2_tab_config';

/* ── ESTADO ── */
let isLoggedIn = false;

/* ── HASH SHA-256 (Web Crypto API) ── */
async function sha256(str) {
  const buf  = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── CONFIGURACIÓN DE PESTAÑAS ── */

/**
 * Devuelve la config guardada en localStorage, o la por defecto.
 * Formato: { particiones: true, formateo: true, archivos: true }
 * Las docenteOnly siempre se excluyen del storage (se manejan por sesión).
 */
function getTabConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  // Defaults: todas las pestañas públicas habilitadas
  return { particiones: true, formateo: true, archivos: true };
}

function saveTabConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (_) { /* ignore */ }
}

/* ── VISIBILIDAD DE NAV ITEMS ── */
function applyTabVisibility() {
  const config = getTabConfig();

  ALL_TABS.forEach(tab => {
    const li = document.getElementById('nav-li-' + tab.id);
    if (!li) return;

    if (tab.locked) {
      // Inicio: siempre visible
      li.style.display = '';
      return;
    }

    if (tab.docenteOnly) {
      // Solo visibles si hay sesión docente activa
      li.style.display = isLoggedIn ? '' : 'none';
      return;
    }

    // Pestañas públicas configurables
    const enabled = isLoggedIn
      ? true                     // docente ve todo
      : (config[tab.id] !== false); // público: según config
    li.style.display = enabled ? '' : 'none';
  });

  // Si la pestaña activa quedó oculta, volver a inicio
  const activeLink = document.querySelector('.nav-links a.active');
  if (activeLink) {
    const liParent = activeLink.closest('li');
    if (liParent && liParent.style.display === 'none') {
      showPage('inicio');
    }
  }
}

/* ── PANEL DOCENTE ── */
function buildDocentePanel() {
  const panel  = document.getElementById('docente-panel');
  const config = getTabConfig();

  if (!panel) return;

  const togglesHTML = ALL_TABS
    .filter(t => !t.locked && !t.docenteOnly)
    .map(tab => {
      const enabled = config[tab.id] !== false;
      return `
        <label class="tab-toggle ${enabled ? 'enabled' : ''}" id="toggle-label-${tab.id}"
               onclick="toggleTabConfig('${tab.id}', this)">
          <span class="check-icon">${enabled ? '✓' : '○'}</span>
          ${tab.label}
        </label>`;
    }).join('');

  panel.innerHTML = `
    <div class="docente-panel-header">
      <h3>⚙ Panel docente <span class="badge">SESIÓN ACTIVA</span></h3>
      <button class="logout-btn" onclick="doLogout()">Cerrar sesión</button>
    </div>
    <p style="font-size:13px;color:var(--text2);margin-bottom:1rem">
      Seleccioná qué pestañas están visibles para los alumnos. Los cambios se guardan automáticamente.
    </p>
    <div class="panel-tabs-config">
      <label class="tab-toggle locked">
        <span class="check-icon">✓</span> Inicio
      </label>
      ${togglesHTML}
      <label class="tab-toggle locked" style="background:var(--amber-bg);border-color:var(--amber);color:var(--amber)">
        <span class="check-icon">✓</span> Casos de usuario <span style="font-size:10px">(docente)</span>
      </label>
      <label class="tab-toggle locked" style="background:var(--amber-bg);border-color:var(--amber);color:var(--amber)">
        <span class="check-icon">✓</span> Guía de clase <span style="font-size:10px">(docente)</span>
      </label>
    </div>
    <p class="panel-save-note">Los cambios afectan solo a las pestañas de alumnos y se guardan en este navegador.</p>`;
}

function toggleTabConfig(tabId, labelEl) {
  const config  = getTabConfig();
  const current = config[tabId] !== false;
  config[tabId] = !current;
  saveTabConfig(config);

  // Actualizar estilo del toggle
  if (config[tabId]) {
    labelEl.classList.add('enabled');
    labelEl.querySelector('.check-icon').textContent = '✓';
  } else {
    labelEl.classList.remove('enabled');
    labelEl.querySelector('.check-icon').textContent = '○';
  }

  applyTabVisibility();
}

/* ── LOGIN ── */
function openLoginModal() {
  document.getElementById('login-overlay').classList.add('open');
  document.getElementById('login-username').focus();
}

function closeLoginModal() {
  document.getElementById('login-overlay').classList.remove('open');
  document.getElementById('login-error').classList.remove('visible');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

async function doLogin() {
  const user     = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  if (!user || !password) {
    errorEl.textContent = 'Completá usuario y contraseña.';
    errorEl.classList.add('visible');
    return;
  }

  const hashed = await sha256(password);

  if (user === AUTH.user && hashed === getCurrentHash()) {
    isLoggedIn = true;
    closeLoginModal();
    onLoginSuccess();
  } else {
    errorEl.textContent = 'Usuario o contraseña incorrectos.';
    errorEl.classList.add('visible');
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function onLoginSuccess() {
  // Actualizar botón nav
  const btn = document.getElementById('nav-login-btn');
  if (btn) {
    btn.textContent = '👤 docente';
    btn.classList.add('logged-in');
    btn.onclick = doLogout;
  }

  // Mostrar panel docente
  const panel = document.getElementById('docente-panel');
  if (panel) {
    buildDocentePanel();
    panel.classList.add('visible');
  }

  applyTabVisibility();
}

function doLogout() {
  isLoggedIn = false;

  const btn = document.getElementById('nav-login-btn');
  if (btn) {
    btn.innerHTML = '🔑 Docente';
    btn.classList.remove('logged-in');
    btn.onclick = openLoginModal;
  }

  const panel = document.getElementById('docente-panel');
  if (panel) panel.classList.remove('visible');

  applyTabVisibility();
}

/* ── ENTER en el form de login ── */
function onLoginKeydown(e) {
  if (e.key === 'Enter') doLogin();
}

/* ── CAMBIO DE CONTRASEÑA ── */
function showChangePassword() {
  document.querySelector('.login-form').style.display       = 'none';
  document.getElementById('change-pw-form').style.display  = 'flex';
  document.getElementById('cp-error').classList.remove('visible');
  document.getElementById('cp-success').style.display      = 'none';
  document.getElementById('cp-current').value  = '';
  document.getElementById('cp-new').value      = '';
  document.getElementById('cp-confirm').value  = '';
  document.getElementById('cp-current').focus();
}

function hideChangePassword() {
  document.querySelector('.login-form').style.display       = '';
  document.getElementById('change-pw-form').style.display  = 'none';
}

async function doChangePassword() {
  const current  = document.getElementById('cp-current').value;
  const newPw    = document.getElementById('cp-new').value;
  const confirm  = document.getElementById('cp-confirm').value;
  const errorEl  = document.getElementById('cp-error');
  const successEl = document.getElementById('cp-success');

  errorEl.classList.remove('visible');
  successEl.style.display = 'none';

  if (!current || !newPw || !confirm) {
    errorEl.textContent = 'Completá todos los campos.';
    errorEl.classList.add('visible');
    return;
  }
  if (newPw.length < 6) {
    errorEl.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
    errorEl.classList.add('visible');
    return;
  }
  if (newPw !== confirm) {
    errorEl.textContent = 'Las contraseñas nuevas no coinciden.';
    errorEl.classList.add('visible');
    return;
  }

  const currentHashed = await sha256(current);
  if (currentHashed !== getCurrentHash()) {
    errorEl.textContent = 'La contraseña actual es incorrecta.';
    errorEl.classList.add('visible');
    document.getElementById('cp-current').value = '';
    document.getElementById('cp-current').focus();
    return;
  }

  const newHashed = await sha256(newPw);
  localStorage.setItem(PW_STORAGE_KEY, newHashed);

  successEl.style.display = 'block';
  document.getElementById('cp-new').value     = '';
  document.getElementById('cp-confirm').value = '';
  document.getElementById('cp-current').value = '';

  // Volver al login tras 2 segundos
  setTimeout(hideChangePassword, 2000);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  applyTabVisibility();

  // Bind tecla Enter en inputs del login
  const inputs = document.querySelectorAll('#login-username, #login-password');
  inputs.forEach(inp => inp.addEventListener('keydown', onLoginKeydown));

  // Cerrar overlay con click fuera del modal
  document.getElementById('login-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
  });
});
