// ── Íconos por especialidad ──────────────────────────────
const ICONS = {
  'Cirugía Veterinaria':       '🔪',
  'Hospitalización':           '🏥',
  'Diagnóstico Avanzado':      '🔬',
  'Dermatología Veterinaria':  '🧴',
  'Odontología Veterinaria':   '🦷',
  'Oncología Veterinaria':     '🎗️',
  'Cardiología Veterinaria':   '❤️',
};

// ── Estado actual ─────────────────────────────────────────
let servicioActual = '';
let pasoActual = 1;

// ── Toggle tarjeta ────────────────────────────────────────
function toggleCard(card) {
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.spec-card').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

// ── Abrir modal ───────────────────────────────────────────
function abrirModal(servicio, e) {
  e.stopPropagation(); // evita que se cierre la tarjeta al hacer clic en el botón

  servicioActual = servicio;
  pasoActual = 1;

  // Título e ícono
  document.getElementById('modal-titulo').textContent   = 'Solicitar cita';
  document.getElementById('modal-servicio').textContent = servicio;
  document.getElementById('modal-icon').textContent     = ICONS[servicio] || '⭐';

  // Reset: mostrar formulario, ocultar éxito
  document.getElementById('modal-form').style.display    = 'block';
  document.getElementById('modal-success').style.display = 'none';

  // Mostrar paso 1
  mostrarPanel(1);

  // Limpiar errores
  ['err-1','err-2','err-3'].forEach(id => document.getElementById(id).textContent = '');

  // Pre-rellenar datos del usuario logueado
  const nombre = localStorage.getItem('tecnoUserFullName') || localStorage.getItem('tecnoUserName') || '';
  const tel    = localStorage.getItem('tecnoUserPhone')    || '';
  const pets   = JSON.parse(localStorage.getItem('tecnoPets') || '[]');

  if (nombre) document.getElementById('m-dueno').value = nombre;
  if (tel)    document.getElementById('m-tel').value   = tel;

  // Si tiene mascotas registradas, pre-rellenar la primera
  if (pets.length > 0) {
    const p = pets[0];
    document.getElementById('m-pet').value   = p.nombre  || '';
    document.getElementById('m-edad').value  = p.edad    || '';
    const espSel = document.getElementById('m-especie');
    if (p.especie) {
      for (let opt of espSel.options) {
        if (opt.value === p.especie) { opt.selected = true; break; }
      }
    }
  }

  // Fecha mínima = hoy
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('m-fecha').min = hoy;

  document.getElementById('modal-overlay').classList.add('open');
}

// ── Cerrar modal ──────────────────────────────────────────
function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Cerrar al hacer clic en el fondo
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});

// ── Navegación entre pasos ────────────────────────────────
function irPaso(n) {
  // Validar el paso actual antes de avanzar
  if (n > pasoActual && !validarPaso(pasoActual)) return;

  // Actualizar resumen en paso 3
  if (n === 3) renderResumen();

  pasoActual = n;
  mostrarPanel(n);
  actualizarIndicador(n);
}

function mostrarPanel(n) {
  [1, 2, 3].forEach(i => {
    const p = document.getElementById('mpanel-' + i);
    if (p) p.style.display = i === n ? 'block' : 'none';
  });
}

function actualizarIndicador(n) {
  [1, 2, 3].forEach(i => {
    const dot  = document.getElementById('mstep-' + i);
    if (!dot) return;
    dot.classList.remove('active', 'done');
    if (i < n)  dot.classList.add('done');
    if (i === n) dot.classList.add('active');
  });
  [1, 2].forEach(i => {
    const line = document.getElementById('mline-' + i);
    if (line) line.classList.toggle('done', i < n);
  });
}

// ── Validación por paso ───────────────────────────────────
function validarPaso(paso) {
  const err = document.getElementById('err-' + paso);

  if (paso === 1) {
    const pet = document.getElementById('m-pet').value.trim();
    if (!pet) { err.textContent = '⚠️ Ingresa el nombre de tu mascota'; return false; }
  }

  if (paso === 2) {
    const fecha = document.getElementById('m-fecha').value;
    const hora  = document.getElementById('m-hora').value;
    const vet   = document.getElementById('m-vet').value;
    const dueno = document.getElementById('m-dueno').value.trim();
    const tel   = document.getElementById('m-tel').value.trim();

    if (!fecha) { err.textContent = '⚠️ Selecciona una fecha'; return false; }
    if (!hora)  { err.textContent = '⚠️ Selecciona una hora';  return false; }
    if (!vet)   { err.textContent = '⚠️ Selecciona un especialista'; return false; }
    if (!dueno) { err.textContent = '⚠️ Ingresa tu nombre'; return false; }
    if (!tel)   { err.textContent = '⚠️ Ingresa tu teléfono'; return false; }
  }

  err.textContent = '';
  return true;
}

// ── Renderizar resumen ────────────────────────────────────
function renderResumen() {
  const pet    = document.getElementById('m-pet').value.trim();
  const esp    = document.getElementById('m-especie').value || '—';
  const edad   = document.getElementById('m-edad').value.trim() || '—';
  const motivo = document.getElementById('m-motivo').value.trim() || '—';
  const fecha  = document.getElementById('m-fecha').value;
  const hora   = document.getElementById('m-hora').value;
  const vet    = document.getElementById('m-vet').value;
  const dueno  = document.getElementById('m-dueno').value.trim();
  const tel    = document.getElementById('m-tel').value.trim();

  const [y, m, d] = fecha.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const fechaLeg = `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;

  const filas = [
    ['Servicio',  servicioActual],
    ['Mascota',   `${pet} · ${esp}${edad !== '—' ? ' · ' + edad : ''}`],
    ['Motivo',    motivo],
    ['Fecha',     fechaLeg],
    ['Hora',      hora],
    ['Especialista', vet],
    ['Dueño',     dueno],
    ['Teléfono',  tel],
  ];

  document.getElementById('resumen-content').innerHTML = filas.map(([lbl, val]) => `
    <div class="resumen-row">
      <span class="resumen-label">${lbl}</span>
      <span class="resumen-val">${val}</span>
    </div>
  `).join('');
}

// ── Confirmar cita ────────────────────────────────────────
function confirmarCita() {
  const pet   = document.getElementById('m-pet').value.trim();
  const fecha = document.getElementById('m-fecha').value;
  const hora  = document.getElementById('m-hora').value;
  const vet   = document.getElementById('m-vet').value;
  const tel   = document.getElementById('m-tel').value.trim();

  const [y, m, d] = fecha.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const fechaLeg = `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;

  document.getElementById('success-msg').textContent =
    `La cita de ${pet} para "${servicioActual}" quedó programada el ${fechaLeg} a las ${hora} con ${vet}. Te contactaremos al ${tel} para confirmar.`;

  document.getElementById('modal-form').style.display    = 'none';
  document.getElementById('modal-success').style.display = 'block';
}
