const adminUsers = [
  { name: 'Melissa Gómez', role: 'Recepcionista', email: 'melissa@technopets.com', status: 'Activo' },
  { name: 'Samuel Bravo', role: 'Veterinario', email: 'samuel@technopets.com', status: 'Activo' },
  { name: 'Karina Suárez', role: 'Administrador', email: 'karina@technopets.com', status: 'Activo' },
  { name: 'David Valdez', role: 'Recepcionista', email: 'david@technopets.com', status: 'Inactivo' }
];

const adminServices = [
  { name: 'Consulta médica', description: 'Revisión general y diagnóstico', price: '$65.000', status: 'Activo' },
  { name: 'Vacunación', description: 'Aplicación de vacunas según plan', price: '$38.000', status: 'Activo' },
  { name: 'Baño y peluquería', description: 'Aseo completo y corte de pelo', price: '$55.000', status: 'Activo' },
  { name: 'Desparasitación', description: 'Tratamiento interno y externo', price: '$45.000', status: 'Activo' }
];

function renderUsers() {
  const query = document.getElementById('admin-search-users').value.trim().toLowerCase();
  const tbody = document.getElementById('users-table');
  tbody.innerHTML = '';

  const filtered = adminUsers.filter(user => {
    return [user.name, user.role, user.email, user.status].some(value => value.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No se encontraron usuarios.</td></tr>';
    return;
  }

  filtered.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td>${user.email}</td>
      <td>${user.status}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderServices() {
  const tbody = document.getElementById('services-table');
  tbody.innerHTML = '';

  adminServices.forEach(service => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${service.name}</td>
      <td>${service.description}</td>
      <td>${service.price}</td>
      <td>${service.status}</td>
    `;
    tbody.appendChild(row);
  });
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.classList.toggle('active', button.textContent.toLowerCase().includes(tab));
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tab}`);
  });
}

function generateReport() { alert('Reporte generado. Descarga el resumen en formato PDF o revisa el dashboard de indicadores.'); }
function addService() { alert('Aquí puedes agregar un servicio nuevo a la oferta de TechnoPets.'); }
function updateAdminSummary() {
  document.getElementById('admin-users').textContent = adminUsers.length;
  document.getElementById('admin-appointments').textContent = 148;
  document.getElementById('admin-revenue').textContent = '$18.450.000';
  document.getElementById('admin-services').textContent = adminServices.length;
}
renderUsers(); renderServices(); updateAdminSummary();
const adminUsers = [
  { name: 'Melissa Gómez', role: 'Recepcionista', email: 'melissa@technopets.com', status: 'Activo' },
  { name: 'Samuel Bravo', role: 'Veterinario', email: 'samuel@technopets.com', status: 'Activo' },
  { name: 'Karina Suárez', role: 'Administrador', email: 'karina@technopets.com', status: 'Activo' },
  { name: 'David Valdez', role: 'Recepcionista', email: 'david@technopets.com', status: 'Inactivo' }
];

const adminServices = [
  { name: 'Consulta médica', description: 'Revisión general y diagnóstico', price: '$65.000', status: 'Activo' },
  { name: 'Vacunación', description: 'Aplicación de vacunas según plan', price: '$38.000', status: 'Activo' },
  { name: 'Baño y peluquería', description: 'Aseo completo y corte de pelo', price: '$55.000', status: 'Activo' },
  { name: 'Desparasitación', description: 'Tratamiento interno y externo', price: '$45.000', status: 'Activo' }
];

function renderUsers() {
  const query = document.getElementById('admin-search-users').value.trim().toLowerCase();
  const tbody = document.getElementById('users-table');
  tbody.innerHTML = '';

  const filtered = adminUsers.filter(user => {
    return [user.name, user.role, user.email, user.status].some(value => value.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No se encontraron usuarios.</td></tr>';
    return;
  }

  filtered.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td>${user.email}</td>
      <td>${user.status}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderServices() {
  const tbody = document.getElementById('services-table');
  tbody.innerHTML = '';

  adminServices.forEach(service => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${service.name}</td>
      <td>${service.description}</td>
      <td>${service.price}</td>
      <td>${service.status}</td>
    `;
    tbody.appendChild(row);
  });
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.classList.toggle('active', button.textContent.toLowerCase().includes(tab));
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tab}`);
  });
}

function generateReport() { alert('Reporte generado. Descarga el resumen en formato PDF o revisa el dashboard de indicadores.'); }
function addService() { alert('Aquí puedes agregar un servicio nuevo a la oferta de TechnoPets.'); }
function updateAdminSummary() {
  document.getElementById('admin-users').textContent = adminUsers.length;
  document.getElementById('admin-appointments').textContent = 148;
  document.getElementById('admin-revenue').textContent = '$18.450.000';
  document.getElementById('admin-services').textContent = adminServices.length;
}
renderUsers(); renderServices(); updateAdminSummary();
