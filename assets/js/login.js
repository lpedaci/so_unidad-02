/* ═══════════════════════════════════════════════════
   login.js — Autenticación docente y control de pestañas
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── CREDENCIALES HASHEADAS (SHA-256) ──────────────
   Contraseña por defecto: docente2025
   Correo autorizado para cambio de contraseña: hasheado
   Ningún dato sensible aparece en texto plano.
   ─────────────────────────────────────────────────── */
const AUTH = {
  defaultHash: '9910e3af60a875b0e651b192d7c035ec84383f5850740b27238fc650f9ed354b',
  emailHash:   'b13adf24c7c247eb548f86f4cf24a87c8d0b6c47609dec9d097c2bcd93165c49'
};

const PW_STORAGE_KEY = 'so_u2_pw_hash';

function getCurrentHash() {
  return localStorage.getItem(PW_STORAGE_KEY) || AUTH.defaultHash;
}

/* ── PESTAÑAS CONFIGURABLES ── */
const ALL_TABS = [
  { id: 'inicio',      label: 'Inicio',              locked: true  },
  { id: 'particiones', label: 'Particiones',          locked: false },
  { id: 'formateo',    label: 'Formateo',             locked: false },
  { id: 'archivos',    label: 'Sistemas de archivos', locked: false },
  { id: 'usuarios',    label: 'Casos de usuario',     locked: false, docenteOnly: true },
  { id: 'guia',        label: 'Guía de clase',        locked: false, docenteOnly: true },
];

const STORAGE_KEY = 'so_u2_tab_config';
let isLoggedIn = false;

/* ── SHA-256 ── */
async function sha256(str) {
  const buf  = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── CONFIG PESTAÑAS ── */
function getTabConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { particiones: true, formateo: true, archivos: true };
}

function saveTabConfig(config) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch (_) {}
}

function applyTabVisibility() {
  const config = getTabConfig();
  ALL_TABS.forEach(tab => {
    const li = document.getElementById('nav-li-' + tab.id);
    if (!li) return;
    if (tab.locked) { li.style.display = ''; return; }
    if (tab.docenteOnly) { li.style.display = isLoggedIn ? '' : 'none'; return; }
    li.style.display = (isLoggedIn || config[tab.id] !== false) ? '' : 'none';
  });
  const activeLink = document.querySelector('.nav-links a.active');
  if (activeLink) {
    const li = activeLink.closest('li');
    if (li && li.style.display === 'none') showPage('inicio');
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
      return `<label class="tab-toggle ${enabled ? 'enabled' : ''}" id="toggle-label-${tab.id}"
               onclick="toggleTabConfig('${tab.id}', this)">
          <span class="check-icon">${enabled ? '✓' : '○'}</span> ${tab.label}
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
      <label class="tab-toggle locked"><span class="check-icon">✓</span> Inicio</label>
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
  config[tabId] = (config[tabId] === false) ? true : false;
  saveTabConfig(config);
  if (config[tabId] !== false) {
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
  showLoginForm();
  document.getElementById('login-overlay').classList.add('open');
  setTimeout(() => document.getElementById('login-password').focus(), 50);
}

function closeLoginModal() {
  document.getElementById('login-overlay').classList.remove('open');
  document.getElementById('login-error').classList.remove('visible');
  document.getElementById('login-password').value = '';
  hideChangePassword();
}

async function doLogin() {
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  if (!password) {
    errorEl.textContent = 'Ingresá la contraseña.';
    errorEl.classList.add('visible');
    return;
  }

  const hashed = await sha256(password);

  if (hashed === getCurrentHash()) {
    isLoggedIn = true;
    closeLoginModal();
    onLoginSuccess();
  } else {
    errorEl.textContent = 'Contraseña incorrecta.';
    errorEl.classList.add('visible');
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function onLoginSuccess() {
  const btn = document.getElementById('nav-login-btn');
  if (btn) {
    btn.textContent = '👤 Docente';
    btn.classList.add('logged-in');
    btn.onclick = doLogout;
  }
  const panel = document.getElementById('docente-panel');
  if (panel) { buildDocentePanel(); panel.classList.add('visible'); }
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

/* ── CAMBIO DE CONTRASEÑA ── */
function showLoginForm() {
  document.getElementById('login-form-section').style.display = '';
  document.getElementById('change-pw-form').style.display     = 'none';
}

function showChangePassword() {
  document.getElementById('login-form-section').style.display = 'none';
  document.getElementById('change-pw-form').style.display     = 'flex';
  document.getElementById('cp-error').classList.remove('visible');
  document.getElementById('cp-success').style.display         = 'none';
  ['cp-email','cp-current','cp-new','cp-confirm']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('cp-email').focus();
}

function hideChangePassword() {
  showLoginForm();
}

async function doChangePassword() {
  const email   = document.getElementById('cp-email').value.trim().toLowerCase();
  const current = document.getElementById('cp-current').value;
  const newPw   = document.getElementById('cp-new').value;
  const confirm = document.getElementById('cp-confirm').value;
  const errEl   = document.getElementById('cp-error');
  const okEl    = document.getElementById('cp-success');

  errEl.classList.remove('visible');
  okEl.style.display = 'none';

  if (!email || !current || !newPw || !confirm) {
    errEl.textContent = 'Completá todos los campos.';
    errEl.classList.add('visible');
    return;
  }

  // 1. Verificar correo autorizado
  const emailHashed = await sha256(email);
  if (emailHashed !== AUTH.emailHash) {
    errEl.textContent = 'El correo ingresado no está autorizado.';
    errEl.classList.add('visible');
    document.getElementById('cp-email').value = '';
    document.getElementById('cp-email').focus();
    return;
  }

  // 2. Verificar contraseña actual
  const currentHashed = await sha256(current);
  if (currentHashed !== getCurrentHash()) {
    errEl.textContent = 'La contraseña actual es incorrecta.';
    errEl.classList.add('visible');
    document.getElementById('cp-current').value = '';
    document.getElementById('cp-current').focus();
    return;
  }

  // 3. Validar nueva contraseña
  if (newPw.length < 6) {
    errEl.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
    errEl.classList.add('visible');
    return;
  }
  if (newPw !== confirm) {
    errEl.textContent = 'Las contraseñas nuevas no coinciden.';
    errEl.classList.add('visible');
    return;
  }

  // 4. Guardar nuevo hash
  localStorage.setItem(PW_STORAGE_KEY, await sha256(newPw));
  okEl.style.display = 'block';
  ['cp-email','cp-current','cp-new','cp-confirm']
    .forEach(id => { document.getElementById(id).value = ''; });

  setTimeout(hideChangePassword, 2000);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  applyTabVisibility();

  document.getElementById('login-password')
    .addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  ['cp-email','cp-current','cp-new','cp-confirm'].forEach(id => {
    document.getElementById(id)
      .addEventListener('keydown', e => { if (e.key === 'Enter') doChangePassword(); });
  });

  document.getElementById('login-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
  });
});
