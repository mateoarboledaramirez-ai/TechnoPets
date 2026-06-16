const appointments = [
  { time: '08:30', pet: 'Max', owner: 'Laura Ríos', service: 'Consulta médica', status: 'Confirmada' },
  { time: '09:15', pet: 'Luna', owner: 'Carlos Méndez', service: 'Vacunación', status: 'En espera' },
  { time: '10:00', pet: 'Nube', owner: 'Ana Torres', service: 'Baño y peluquería', status: 'Confirmada' },
  { time: '11:30', pet: 'Oreo', owner: 'Diego Pérez', service: 'Desparasitación', status: 'Confirmada' },
  { time: '13:00', pet: 'Milo', owner: 'Paola Silva', service: 'Corte de uñas', status: 'Pendiente' }
];

const petsCount = 132;

function renderSummary() {
  document.getElementById('stat-appointments').textContent = appointments.length;
  document.getElementById('stat-pets').textContent = petsCount;
  document.getElementById('stat-pending').textContent = appointments.filter(a => a.status === 'En espera' || a.status === 'Pendiente').length;
  document.getElementById('stat-completed').textContent = appointments.filter(a => a.status === 'Finalizada').length;
}

function renderAppointments() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const tbody = document.getElementById('appointments-table');
  tbody.innerHTML = '';

  const filtered = appointments.filter(appointment => {
    return [appointment.time, appointment.pet, appointment.owner, appointment.service, appointment.status]
      .some(value => value.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No hay citas que coincidan con la búsqueda.</td></tr>';
    return;
  }

  filtered.forEach((appointment, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${appointment.time}</td>
      <td>${appointment.pet}</td>
      <td>${appointment.owner}</td>
      <td>${appointment.service}</td>
      <td><span class="badge ${formatStatusClass(appointment.status)}">${appointment.status}</span></td>
      <td><button class="action-btn" onclick="viewDetails(${index})">Ver</button></td>
    `;

    tbody.appendChild(row);
  });
}

function formatStatusClass(status) {
  return status.toLowerCase().includes('espera') ? 'pending'
    : status.toLowerCase().includes('pendiente') ? 'pending'
    : status.toLowerCase().includes('confirmada') ? 'confirmed'
    : status.toLowerCase().includes('finalizada') ? 'completed'
    : 'confirmed';
}

function viewDetails(index) {
  const appointment = appointments[index];
  alert(`Cita\nMascota: ${appointment.pet}\nDueño: ${appointment.owner}\nServicio: ${appointment.service}\nHora: ${appointment.time}\nEstado: ${appointment.status}`);
}

function goToNewAppointment() {
  alert('Aquí podrías agregar un formulario para crear una nueva cita.');
}

renderSummary();
renderAppointments();
const appointments = [
  { time: '08:30', pet: 'Max', owner: 'Laura Ríos', service: 'Consulta médica', status: 'Confirmada' },
  { time: '09:15', pet: 'Luna', owner: 'Carlos Méndez', service: 'Vacunación', status: 'En espera' },
  { time: '10:00', pet: 'Nube', owner: 'Ana Torres', service: 'Baño y peluquería', status: 'Confirmada' },
  { time: '11:30', pet: 'Oreo', owner: 'Diego Pérez', service: 'Desparasitación', status: 'Confirmada' },
  { time: '13:00', pet: 'Milo', owner: 'Paola Silva', service: 'Corte de uñas', status: 'Pendiente' }
];

const petsCount = 132;

function renderSummary() {
  document.getElementById('stat-appointments').textContent = appointments.length;
  document.getElementById('stat-pets').textContent = petsCount;
  document.getElementById('stat-pending').textContent = appointments.filter(a => a.status === 'En espera' || a.status === 'Pendiente').length;
  document.getElementById('stat-completed').textContent = appointments.filter(a => a.status === 'Finalizada').length;
}

function renderAppointments() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const tbody = document.getElementById('appointments-table');
  tbody.innerHTML = '';

  const filtered = appointments.filter(appointment => {
    return [appointment.time, appointment.pet, appointment.owner, appointment.service, appointment.status]
      .some(value => value.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No hay citas que coincidan con la búsqueda.</td></tr>';
    return;
  }

  filtered.forEach((appointment, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${appointment.time}</td>
      <td>${appointment.pet}</td>
      <td>${appointment.owner}</td>
      <td>${appointment.service}</td>
      <td><span class="badge ${formatStatusClass(appointment.status)}">${appointment.status}</span></td>
      <td><button class="action-btn" onclick="viewDetails(${index})">Ver</button></td>
    `;

    tbody.appendChild(row);
  });
}

function formatStatusClass(status) {
  return status.toLowerCase().includes('espera') ? 'pending'
    : status.toLowerCase().includes('pendiente') ? 'pending'
    : status.toLowerCase().includes('confirmada') ? 'confirmed'
    : status.toLowerCase().includes('finalizada') ? 'completed'
    : 'confirmed';
}

function viewDetails(index) {
  const appointment = appointments[index];
  alert(`Cita\nMascota: ${appointment.pet}\nDueño: ${appointment.owner}\nServicio: ${appointment.service}\nHora: ${appointment.time}\nEstado: ${appointment.status}`);
}

function goToNewAppointment() { alert('Aquí podrías agregar un formulario para crear una nueva cita.'); }

renderSummary(); renderAppointments();
