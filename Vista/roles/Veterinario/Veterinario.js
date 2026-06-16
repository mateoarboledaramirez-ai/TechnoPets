const vetAppointments = [ { id: 1, time: '08:30', pet: 'Max', owner: 'Laura Ríos', service: 'Consulta médica', reason: 'Chequeo anual y vacunación', status: 'Confirmada', notes: '' }, { id: 2, time: '09:15', pet: 'Luna', owner: 'Carlos Méndez', service: 'Vacunación', reason: 'Vacuna antirrábica', status: 'En espera', notes: '' }, { id: 3, time: '10:45', pet: 'Oreo', owner: 'Diego Pérez', service: 'Desparasitación', reason: 'Control de parásitos internos', status: 'Confirmada', notes: '' }, { id: 4, time: '12:00', pet: 'Milo', owner: 'Paola Silva', service: 'Corte de uñas', reason: 'Uñas muy largas', status: 'Confirmada', notes: '' } ];
let selectedAppointmentId = null;
function renderAppointments() { const query = document.getElementById('vet-search').value.trim().toLowerCase(); const tbody = document.getElementById('vet-appointments'); tbody.innerHTML = ''; const filtered = vetAppointments.filter(item => { return [item.time, item.pet, item.owner, item.service, item.status, item.reason].some(value => value.toLowerCase().includes(query)); }); if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No se encontraron citas.</td></tr>'; return; } filtered.forEach(appointment => { const row = document.createElement('tr'); row.innerHTML = ` <td>${appointment.time}</td> <td>${appointment.pet}</td> <td>${appointment.service}</td> <td><span class="badge ${formatStatusClass(appointment.status)}">${appointment.status}</span></td> `; row.addEventListener('click', () => selectAppointment(appointment.id)); tbody.appendChild(row); }); }
function selectAppointment(id) { const appointment = vetAppointments.find(item => item.id === id); if (!appointment) return; selectedAppointmentId = id; document.getElementById('detail-pet').textContent = appointment.pet; document.getElementById('detail-owner').textContent = appointment.owner; document.getElementById('detail-service').textContent = appointment.service; document.getElementById('detail-reason').textContent = appointment.reason; document.getElementById('detail-time').textContent = appointment.time; document.getElementById('detail-state').textContent = appointment.status; document.getElementById('detail-status').textContent = appointment.status; document.getElementById('vet-notes').value = appointment.notes; }
function changeStatus(status) { if (!selectedAppointmentId) { alert('Selecciona primero una cita.'); return; } const appointment = vetAppointments.find(item => item.id === selectedAppointmentId); if (!appointment) return; appointment.status = status; appointment.notes = document.getElementById('vet-notes').value.trim(); selectAppointment(appointment.id); renderAppointments(); }
function loadNextAppointment() { if (vetAppointments.length === 0) return; selectAppointment(vetAppointments[0].id); }
function formatStatusClass(status) { return status.toLowerCase().includes('espera') ? 'pending' : status.toLowerCase().includes('confirmada') ? 'confirmed' : status.toLowerCase().includes('finalizada') ? 'completed' : 'confirmed'; }
renderAppointments(); loadNextAppointment();
const vetAppointments = [
  { id: 1, time: '08:30', pet: 'Max', owner: 'Laura Ríos', service: 'Consulta médica', reason: 'Chequeo anual y vacunación', status: 'Confirmada', notes: '' },
  { id: 2, time: '09:15', pet: 'Luna', owner: 'Carlos Méndez', service: 'Vacunación', reason: 'Vacuna antirrábica', status: 'En espera', notes: '' },
  { id: 3, time: '10:45', pet: 'Oreo', owner: 'Diego Pérez', service: 'Desparasitación', reason: 'Control de parásitos internos', status: 'Confirmada', notes: '' },
  { id: 4, time: '12:00', pet: 'Milo', owner: 'Paola Silva', service: 'Corte de uñas', reason: 'Uñas muy largas', status: 'Confirmada', notes: '' }
];

let selectedAppointmentId = null;

function renderAppointments() {
  const query = document.getElementById('vet-search').value.trim().toLowerCase();
  const tbody = document.getElementById('vet-appointments');
  tbody.innerHTML = '';

  const filtered = vetAppointments.filter(item => {
    return [item.time, item.pet, item.owner, item.service, item.status, item.reason]
      .some(value => value.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No se encontraron citas.</td></tr>';
    return;
  }

  filtered.forEach(appointment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${appointment.time}</td>
      <td>${appointment.pet}</td>
      <td>${appointment.service}</td>
      <td><span class="badge ${formatStatusClass(appointment.status)}">${appointment.status}</span></td>
    `;
    row.addEventListener('click', () => selectAppointment(appointment.id));
    tbody.appendChild(row);
  });
}

function selectAppointment(id) {
  const appointment = vetAppointments.find(item => item.id === id);
  if (!appointment) return;
  selectedAppointmentId = id;

  document.getElementById('detail-pet').textContent = appointment.pet;
  document.getElementById('detail-owner').textContent = appointment.owner;
  document.getElementById('detail-service').textContent = appointment.service;
  document.getElementById('detail-reason').textContent = appointment.reason;
  document.getElementById('detail-time').textContent = appointment.time;
  document.getElementById('detail-state').textContent = appointment.status;
  document.getElementById('detail-status').textContent = appointment.status;
  document.getElementById('vet-notes').value = appointment.notes;
}

function changeStatus(status) {
  if (!selectedAppointmentId) { alert('Selecciona primero una cita.'); return; }
  const appointment = vetAppointments.find(item => item.id === selectedAppointmentId);
  if (!appointment) return;
  appointment.status = status;
  appointment.notes = document.getElementById('vet-notes').value.trim();
  selectAppointment(appointment.id);
  renderAppointments();
}

function loadNextAppointment() { if (vetAppointments.length === 0) return; selectAppointment(vetAppointments[0].id); }
function formatStatusClass(status) { return status.toLowerCase().includes('espera') ? 'pending' : status.toLowerCase().includes('confirmada') ? 'confirmed' : status.toLowerCase().includes('finalizada') ? 'completed' : 'confirmed'; }
renderAppointments(); loadNextAppointment();
