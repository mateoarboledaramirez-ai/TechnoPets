// ── ESTADO ───────────────────────────────────────────────
  let state = {
    petType:'perro', petName:'', breed:'', age:'', sex:'', weight:'',
    ownerName:'', phone:'', email:'', date:'', time:'', vet:'', reason:'',
    service:''
  };
  let fromProfile = false;
  
  // ── CARGAR DATOS DEL USUARIO ─────────────────────────────
  const loggedUserName = localStorage.getItem('tecnoUserFullName') || localStorage.getItem('tecnoUserName') || 'Cliente';
  const loggedUserEmail = localStorage.getItem('tecnoUserEmail') || '';
  const loggedUserPhone = localStorage.getItem('tecnoUserPhone') || '';

  // Cargar mascotas del usuario desde localStorage
  let userPets = [];
  function loadUserPets() {
    // Las mascotas se guardan en 'tecnoPets' por Inicio_de_sesion.js
    const rawPets = JSON.parse(localStorage.getItem('tecnoPets') || '[]');
    // Normalizar campos: Inicio_de_sesion.js guarda {especie, emoji, nombre, raza, edad, sexo, peso}
    // Consulta_y_medicina_preventiva.js espera {tipo, nombre, raza, edad, sexo, peso, duenio, telefono, correo}
    userPets = rawPets.map(pet => ({
      tipo:     pet.especie  || pet.tipo     || 'Otro',
      emoji:    pet.emoji    || '🐾',
      nombre:   pet.nombre   || '',
      raza:     pet.raza     || '',
      edad:     pet.edad     || '',
      sexo:     pet.sexo     || '',
      peso:     pet.peso     || '',
      duenio:   pet.duenio   || loggedUserName,
      telefono: pet.telefono || pet.tel || loggedUserPhone || '',
      correo:   pet.correo   || loggedUserEmail,
      historial: pet.historial || []
    }));
  }
  
  // Actualizar mensaje de bienvenida con el nombre del usuario
  window.addEventListener('DOMContentLoaded', () => {
    const welcomeSub = document.getElementById('welcome-sub');
    if (welcomeSub) {
      welcomeSub.textContent = `Hola ${loggedUserName}, ¿qué necesitas hoy?`;
    }
    
    // Pre-llenar campos del formulario con datos del usuario
    const ownerNameField = document.getElementById('owner-name');
    const ownerPhoneField = document.getElementById('owner-phone');
    const ownerEmailField = document.getElementById('owner-email');
    
    if (ownerNameField && loggedUserName) ownerNameField.value = loggedUserName;
    if (ownerPhoneField && loggedUserPhone) ownerPhoneField.value = loggedUserPhone;
    if (ownerEmailField && loggedUserEmail) ownerEmailField.value = loggedUserEmail;
    
    loadUserPets();
  });

  // ── BASE DE DATOS DEMO ───────────────────────────────────
  const petDB = [
    { name:'Max', type:'perro', breed:'Labrador', age:'3', sex:'Macho', weight:'25',
      owner:'Laura Gómez', phone:'3001234567', email:'laura@email.com',
      history:[
        {date:'12/03/2024',desc:'Vacuna antirrábica'},
        {date:'15/06/2024',desc:'Desparasitación'},
        {date:'10/09/2024',desc:'Consulta por alergia'},
        {date:'05/12/2024',desc:'Control general'}
      ]
    },
    { name:'Luna', type:'gato', breed:'Siamés', age:'2', sex:'Hembra', weight:'4',
      owner:'Carlos Ruiz', phone:'3109876543', email:'carlos@email.com',
      history:[
        {date:'20/01/2024',desc:'Vacuna triple felina'},
        {date:'10/05/2024',desc:'Esterilización'}
      ]
    }
  ];

  const times = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
                 '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

  document.getElementById('appt-date').min = new Date().toISOString().split('T')[0];
  document.getElementById('appt-date').addEventListener('change', function() {
    if (this.value) {
      state.date = this.value;
      renderTimes();
      document.getElementById('time-section').style.display = 'block';
      state.time = '';
    }
  });

  // ── NAVEGACIÓN ───────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    el.classList.add('active');
    el.style.animation = 'none';
    setTimeout(() => el.style.animation = '', 10);
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function goMenu() {
    document.getElementById('progress').style.display = 'none';
    showScreen('screen-menu');
  }

  // ── BUSCAR MASCOTA (ver perfil) - DESHABILITADO POR CLIENTE ──
  // Estas funciones ya no se usan desde el menú, pero se mantienen
  // por compatibilidad si se necesita acceder desde otras pantallas
  function showSearch() {
    clearFields(['search-pet-name','search-owner-phone']);
    showScreen('screen-search');
  }

  function doSearch() {
    liveValidate('search-pet-name');
    liveValidate('search-owner-phone');
    if (hasErrors(['search-pet-name','search-owner-phone'])) return;
    const name  = document.getElementById('search-pet-name').value.trim();
    const phone = document.getElementById('search-owner-phone').value.trim();
    const found = petDB.find(p => p.name.toLowerCase()===name.toLowerCase() && p.phone===phone);
    if (found) { renderProfile(found); showScreen('screen-profile'); }
    else showScreen('screen-notfound');
  }

  // ── AGENDAR CITA (mostrar mascotas del usuario) ──────────
  function startAgenda() {
    fromProfile = false;
    loadUserPets();
    renderUserPets();
    document.getElementById('progress').style.display = 'none';
    showScreen('screen-select-pet');
  }
  
  function renderUserPets() {
    const list = document.getElementById('user-pets-list');
    list.innerHTML = '';
    
    if (userPets.length === 0) {
      list.innerHTML = `
        <div class="not-found">
          <div class="nf-icon">🐾</div>
          <p style="font-weight:600; color:var(--text); margin-bottom:8px">No tienes mascotas registradas</p>
          <p>Regresa al inicio de sesión y crea una cuenta con tus mascotas para poder agendar una cita.</p>
        </div>
      `;
      return;
    }
    
    userPets.forEach((pet, idx) => {
      const typeIcon = pet.emoji || (pet.tipo.toLowerCase() === 'perro' ? '🐶' : pet.tipo.toLowerCase() === 'gato' ? '🐱' : pet.tipo.toLowerCase() === 'ave' ? '🐦' : '🐾');
      const card = document.createElement('div');
      card.className = 'vet-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="vet-avatar" style="background:rgba(107,143,113,0.15); font-size:1.4rem;">${typeIcon}</div>
        <div class="vet-info" style="flex:1">
          <div class="vet-name">${pet.nombre}</div>
          <div class="vet-spec">${pet.raza} • ${pet.edad} años</div>
        </div>
      `;
      card.onclick = () => selectUserPet(idx);
      list.appendChild(card);
    });
  }
  
  function selectUserPet(idx) {
    const pet = userPets[idx];
    state.petType = pet.tipo.toLowerCase();
    state.petName = pet.nombre;
    state.breed = pet.raza;
    state.age = pet.edad;
    state.sex = pet.sexo;
    state.weight = pet.peso;
    state.ownerName = pet.duenio;
    state.phone = pet.telefono;
    state.email = pet.correo;
    
    // Ir al paso 2 (confirmación)
    state.date = ''; state.time = ''; state.vet = ''; state.reason = ''; state.service = '';
    document.getElementById('appt-date').value = '';
    document.getElementById('time-section').style.display = 'none';
    document.getElementById('reason').value = '';
    document.querySelectorAll('.vet-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    
    renderConfirmPet();
    document.getElementById('progress').style.display = 'flex';
    updateProgress(2);
    showScreen('screen-2');
  }

  // ── AGENDAR CITA (buscar mascota) ────────────────────────
  function startAgendaFromProfile() {
    fromProfile = true;
    state.date=''; state.time=''; state.vet=''; state.reason=''; state.service='';
    document.getElementById('appt-date').value = '';
    document.getElementById('time-section').style.display = 'none';
    document.getElementById('reason').value = '';
    document.querySelectorAll('.vet-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    renderConfirmPet();
    document.getElementById('progress').style.display = 'flex';
    updateProgress(2);
    showScreen('screen-2');
  }

  // ── REGISTRAR MASCOTA ────────────────────────────────────
  function startRegister() {
    fromProfile = false;
    resetState();
    document.getElementById('progress').style.display = 'none';
    showScreen('screen-1');
  }

  function saveRegister() {
    // Reutiliza validate(1) para validar y guardar en petDB
    if(!validate(1)) return;
    // Mostrar resumen del registro
    const icon = petIcon(state.petType);
    document.getElementById('register-summary').innerHTML = `
      <div class="summary-row"><span class="summary-label">Mascota</span><span class="summary-value">${icon} ${state.petName}${state.breed?' — '+state.breed:''}</span></div>
      <div class="summary-row"><span class="summary-label">Especie</span><span class="summary-value">${cap(state.petType)}</span></div>
      <div class="summary-row"><span class="summary-label">Edad / Sexo</span><span class="summary-value">${state.age} años · ${state.sex}</span></div>
      <div class="summary-row"><span class="summary-label">Dueño</span><span class="summary-value">${state.ownerName}</span></div>
      <div class="summary-row"><span class="summary-label">Teléfono</span><span class="summary-value">${state.phone}</span></div>
    `;
    showScreen('screen-register-ok');
  }

  // ── DESDE PERFIL → AGENDAR ───────────────────────────────
  function startAgendaFromProfile() {
    fromProfile = true;
    state.date=''; state.time=''; state.vet=''; state.reason=''; state.service='';
    document.getElementById('appt-date').value = '';
    document.getElementById('time-section').style.display = 'none';
    document.getElementById('reason').value = '';
    document.querySelectorAll('.vet-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    renderConfirmPet();
    document.getElementById('progress').style.display = 'flex';
    updateProgress(2);
    showScreen('screen-2');
  }

  function backFromStep3() {
    if (fromProfile) { updateProgress(3); showScreen('screen-25'); }
    else goStep(25);
  }

  // ── PERFIL ───────────────────────────────────────────────
  function renderProfile(pet) {
    const icon = petIcon(pet.type);
    document.getElementById('profile-content').innerHTML = `
      <div class="pet-profile-header">
        <div class="pet-big-avatar">${icon}</div>
        <div><div class="pet-profile-name">${pet.name}</div>
        <div class="pet-profile-sub">${pet.breed} · ${cap(pet.type)}</div></div>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="lbl">Edad</div><div class="val">${pet.age} años</div></div>
        <div class="info-item"><div class="lbl">Sexo</div><div class="val">${pet.sex}</div></div>
        <div class="info-item"><div class="lbl">Peso</div><div class="val">${pet.weight} kg</div></div>
        <div class="info-item"><div class="lbl">Propietario</div><div class="val">${pet.owner}</div></div>
        <div class="info-item"><div class="lbl">Teléfono</div><div class="val">${pet.phone}</div></div>
        ${pet.email?`<div class="info-item"><div class="lbl">Correo</div><div class="val" style="word-break:break-all">${pet.email}</div></div>`:''}
      </div>
      <div class="history-title">📋 Historial médico</div>
      ${pet.history.map(h=>`<div class="history-entry"><span class="history-date">${h.date}</span><span class="history-desc">${h.desc}</span></div>`).join('')}
    `;
    state.petName=pet.name; state.petType=pet.type; state.breed=pet.breed;
    state.age=pet.age; state.sex=pet.sex; state.weight=pet.weight;
    state.ownerName=pet.owner; state.phone=pet.phone; state.email=pet.email;
  }

  function renderConfirmPet() {
    document.getElementById('confirm-pet-box').innerHTML = `
      <div class="summary-row"><span class="summary-label">Nombre</span><span class="summary-value">${petIcon(state.petType)} ${state.petName}</span></div>
      <div class="summary-row"><span class="summary-label">Especie / Raza</span><span class="summary-value">${cap(state.petType)}${state.breed?' · '+state.breed:''}</span></div>
      <div class="summary-row"><span class="summary-label">Propietario</span><span class="summary-value">${state.ownerName}</span></div>
      <div class="summary-row"><span class="summary-label">Teléfono</span><span class="summary-value">${state.phone}</span></div>
      ${state.email?`<div class="summary-row"><span class="summary-label">Correo</span><span class="summary-value">${state.email}</span></div>`:''}
    `;
  }

  // ── HELPERS ──────────────────────────────────────────────
  function petIcon(t) { return t==='perro'?'🐶':t==='gato'?'🐱':t==='ave'?'🐦':'🐾'; }
  function cap(s) { return s.charAt(0).toUpperCase()+s.slice(1); }
  function hasErrors(ids) { return ids.some(id => document.getElementById(id).classList.contains('error') || !document.getElementById(id).value.trim()); }
  function clearFields(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      const err = document.getElementById('err-'+id);
      if (el) { el.value=''; el.classList.remove('error'); }
      if (err) { err.textContent=''; err.classList.remove('show'); }
    });
  }

  // ── TIEMPOS ──────────────────────────────────────────────
  function renderTimes() {
    const grid = document.getElementById('time-grid');
    grid.innerHTML = '';
    const seed = state.date.replace(/-/g,'').slice(-2) % 7;
    times.forEach((t,i) => {
      const btn = document.createElement('button');
      btn.className = 'time-btn' + (state.time===t?' selected':'');
      const unavail = (i+seed)%5===0;
      btn.textContent = t;
      if (unavail) { btn.style.opacity='0.35'; btn.style.cursor='not-allowed'; btn.title='No disponible'; }
      else btn.onclick = () => { document.querySelectorAll('.time-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); state.time=t; document.getElementById('err-time').classList.remove('show'); };
      grid.appendChild(btn);
    });
  }

  function selectPet(btn) {
    document.querySelectorAll('.pet-type-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    state.petType = btn.dataset.pet;
  }

  // ── ESPECIALISTAS POR SERVICIO ───────────────────────────
  const specialists = {
    'Consulta médica': [
      { name:'Dr. Carlos Ramírez',   spec:'Medicina General', bg:'#d4e8d7', icon:'🧑‍⚕️' },
      { name:'Dra. Laura Martínez',  spec:'Medicina General', bg:'#fde8d8', icon:'👩‍⚕️' },
      { name:'Dr. Andrés Gómez',     spec:'Medicina General', bg:'#dde4f5', icon:'🧑‍⚕️' },
    ],
    'Vacunación': [
      { name:'Dra. Paula Rodríguez', spec:'Vacunología',       bg:'#fde8d8', icon:'👩‍⚕️' },
      { name:'Dr. Daniel Herrera',   spec:'Vacunología',       bg:'#d4e8d7', icon:'🧑‍⚕️' },
      { name:'Dra. Camila Torres',   spec:'Vacunología',       bg:'#f5ddf5', icon:'👩‍⚕️' },
    ],
    'Desparasitación': [
      { name:'Dr. Sebastián Castro', spec:'Parasitología',     bg:'#d4e8d7', icon:'🧑‍⚕️' },
      { name:'Dra. Valentina López', spec:'Parasitología',     bg:'#fde8d8', icon:'👩‍⚕️' },
      { name:'Dr. Miguel Sánchez',   spec:'Parasitología',     bg:'#dde4f5', icon:'🧑‍⚕️' },
    ],
    'Baño y peluquería': [
      { name:'Ana Morales',          spec:'Peluquería canina', bg:'#fdf5d4', icon:'💇' },
      { name:'Luis Fernández',       spec:'Peluquería canina', bg:'#d4e8d7', icon:'✂️' },
      { name:'Sofía Rojas',          spec:'Peluquería canina', bg:'#fde8d8', icon:'🛁' },
    ],
    'Corte de uñas': [
      { name:'Dr. Juan Pérez',       spec:'Cuidado básico',    bg:'#d4e8d7', icon:'🧑‍⚕️' },
      { name:'Dra. Natalia Vargas',  spec:'Cuidado básico',    bg:'#fde8d8', icon:'👩‍⚕️' },
      { name:'Dr. Felipe Díaz',      spec:'Cuidado básico',    bg:'#dde4f5', icon:'🧑‍⚕️' },
    ],
  };

  function renderVetList() {
    const list = document.getElementById('vet-list-dynamic');
    const sub  = document.getElementById('vet-screen-sub');
    const vets = specialists[state.service] || [];
    state.vet = ''; // reset al cambiar servicio
    sub.textContent = `Especialistas en: ${state.service}`;
    list.innerHTML = vets.map(v => `
      <div class="vet-card" onclick="selectVet(this,'${v.name}')">
        <div class="vet-avatar" style="background:${v.bg};">${v.icon}</div>
        <div class="vet-info">
          <div class="vet-name">${v.name}</div>
          <div class="vet-spec">${v.spec}</div>
        </div>
      </div>
    `).join('');
  }

  function selectVet(card, name) {
    document.querySelectorAll('.vet-card').forEach(c=>c.classList.remove('selected'));
    document.querySelectorAll('.service-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    state.vet = name;
    document.getElementById('err-vet').classList.remove('show');
  }

  function selectService(card, name) {
    document.querySelectorAll('.service-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    state.service = name;
    document.getElementById('err-service').classList.remove('show');
  }

  // ── VALIDACIÓN ───────────────────────────────────────────
  const fieldRules = {
    'pet-name':           {required:true,  pattern:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,  msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo letras, no se permiten números (ej: Max)'},
    'pet-breed':          {required:false, pattern:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,  msgEmpty:'', msgFormat:'⚠ Solo letras, no se permiten números (ej: Labrador)'},
    'pet-age':            {required:true,  pattern:/^\d+$/,                          msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo números enteros, no se permiten letras (ej: 3)'},
    'pet-sex':            {required:true,  isSelect:true,                            msgEmpty:'⚠ Es obligatorio seleccionar una opción', msgFormat:''},
    'pet-weight':         {required:false, pattern:/^\d+(\.\d+)?$/,                 msgEmpty:'', msgFormat:'⚠ Solo números con decimales, no letras (ej: 8.5)'},
    'owner-name':         {required:true,  pattern:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,  msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo letras y espacios, no se permiten números (ej: Laura Gómez)'},
    'owner-phone':        {required:true,  pattern:/^[\d\s\+\-]{7,}$/,              msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo números, mínimo 7 dígitos, no letras (ej: 3001234567)'},
    'owner-email':        {required:false, pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,    msgEmpty:'', msgFormat:'⚠ Formato inválido, debe tener @ y dominio (ej: correo@dominio.com)'},
    'search-pet-name':    {required:true,  pattern:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,  msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo letras, no se permiten números (ej: Max)'},
    'search-owner-phone': {required:true,  pattern:/^[\d\s\+\-]{7,}$/,              msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo números, mínimo 7 dígitos, no letras (ej: 3001234567)'},
    'agenda-pet-name':    {required:true,  pattern:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,  msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo letras, no se permiten números (ej: Max)'},
    'agenda-owner-phone': {required:true,  pattern:/^[\d\s\+\-]{7,}$/,              msgEmpty:'⚠ Es obligatorio llenar esta casilla', msgFormat:'⚠ Solo números, mínimo 7 dígitos, no letras (ej: 3001234567)'},
  };

  function getMsg(rule, val) {
    if (rule.isSelect) return !val ? rule.msgEmpty : '';
    if (rule.required && !val) return rule.msgEmpty;
    if (val && rule.pattern && !rule.pattern.test(val)) return rule.msgFormat;
    return '';
  }

  function liveValidate(id) {
    const rule=fieldRules[id]; if(!rule) return;
    const el=document.getElementById(id), err=document.getElementById('err-'+id);
    if(!el||!err) return;
    const msg = getMsg(rule, el.value.trim());
    err.textContent = msg;
    if(msg){err.classList.add('show');el.classList.add('error');}
    else{err.classList.remove('show');el.classList.remove('error');}
  }

  function validate(step) {
    let ok = true;
    const check = id => {
      const rule=fieldRules[id]; if(!rule) return;
      const el=document.getElementById(id), err=document.getElementById('err-'+id);
      if(!el||!err) return;
      const msg = getMsg(rule, el.value.trim());
      err.textContent=msg;
      if(msg){err.classList.add('show');el.classList.add('error');ok=false;}
      else{err.classList.remove('show');el.classList.remove('error');}
    };

    if(step===1){
      ['pet-name','pet-breed','pet-age','pet-sex','pet-weight','owner-name','owner-phone','owner-email'].forEach(check);
      if(ok){
        state.petName=document.getElementById('pet-name').value.trim();
        state.breed=document.getElementById('pet-breed').value.trim();
        state.age=document.getElementById('pet-age').value.trim();
        state.sex=document.getElementById('pet-sex').value;
        state.weight=document.getElementById('pet-weight').value.trim();
        state.ownerName=document.getElementById('owner-name').value.trim();
        state.phone=document.getElementById('owner-phone').value.trim();
        state.email=document.getElementById('owner-email').value.trim();
        // Guardar en la base de datos si no existe ya
        const existe = petDB.find(p => p.name.toLowerCase()===state.petName.toLowerCase() && p.phone===state.phone);
        if(!existe){
          petDB.push({
            name: state.petName, type: state.petType, breed: state.breed,
            age: state.age, sex: state.sex, weight: state.weight,
            owner: state.ownerName, phone: state.phone, email: state.email,
            history: []
          });
        }
      }
    }
    if(step===25){
      const se=document.getElementById('err-service');
      if(!state.service){se.textContent='⚠ Es obligatorio seleccionar un servicio';se.classList.add('show');ok=false;}
      else se.classList.remove('show');
    }
    if(step===3){
      const de=document.getElementById('err-date'), te=document.getElementById('err-time');
      if(!state.date){de.textContent='⚠ Es obligatorio seleccionar una fecha';de.classList.add('show');ok=false;}
      else de.classList.remove('show');
      if(!state.time){te.textContent='⚠ Es obligatorio seleccionar un horario';te.classList.add('show');ok=false;}
      else te.classList.remove('show');
    }
    if(step===4){
      const ve=document.getElementById('err-vet');
      if(!state.vet){ve.textContent='⚠ Es obligatorio seleccionar un veterinario';ve.classList.add('show');ok=false;}
      else ve.classList.remove('show');
    }
    if(step===5) state.reason=document.getElementById('reason').value.trim();
    return ok;
  }

  // ── PROGRESO ─────────────────────────────────────────────
  function updateProgress(n) {
    for(let s=2;s<=8;s++){
      const d=document.getElementById('dot-'+s); if(!d) continue;
      d.classList.remove('active','done');
      if(s<n) d.classList.add('done');
      if(s===n) d.classList.add('active');
    }
    for(let s=2;s<=7;s++){
      const l=document.getElementById('line-'+s);
      if(l) l.classList.toggle('done',s<n);
    }
  }

  // ── PASO A PASO ──────────────────────────────────────────
  function goStep(n) {
    const activeId = document.querySelector('.screen.active').id;
    const curr = activeId === 'screen-25' ? 25 : parseInt(activeId.replace('screen-',''));
    if(!isNaN(curr) && n>curr && !validate(curr)) return;
    const inFlow = (n>=2 && n<=8) || n===25;
    document.getElementById('progress').style.display = inFlow ? 'flex' : 'none';
    // Map step to progress dot: 2→2, 25→3, 3→4, 4→5, 5→6, 6→7, 7→8
    const dotMap = {2:2, 25:3, 3:4, 4:5, 5:6, 6:7, 7:8};
    if(inFlow && dotMap[n]) updateProgress(dotMap[n]);
    if(n===2) renderConfirmPet();
    if(n===4) renderVetList();
    if(n===6) document.getElementById('summary-content').innerHTML = summaryHTML();
    if(n===7) document.getElementById('final-summary').innerHTML = summaryHTML();
    showScreen(n===25 ? 'screen-25' : 'screen-'+n);
  }

  // ── RESUMEN ──────────────────────────────────────────────
  function formatDate(d) {
    const [y,m,day]=d.split('-');
    const M=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(day)} de ${M[parseInt(m)-1]} de ${y}`;
  }
  function summaryHTML() {
    return `
      <div class="summary-row"><span class="summary-label">Mascota</span><span class="summary-value">${petIcon(state.petType)} ${state.petName}${state.breed?' — '+state.breed:''}</span></div>
      <div class="summary-row"><span class="summary-label">Edad / Sexo</span><span class="summary-value">${state.age} años · ${state.sex}</span></div>
      <div class="summary-row"><span class="summary-label">Dueño</span><span class="summary-value">${state.ownerName}</span></div>
      <div class="summary-row"><span class="summary-label">Teléfono</span><span class="summary-value">${state.phone}</span></div>
      ${state.email?`<div class="summary-row"><span class="summary-label">Correo</span><span class="summary-value">${state.email}</span></div>`:''}
      <div class="summary-row"><span class="summary-label">Servicio</span><span class="summary-value">${state.service}</span></div>
      <div class="summary-row"><span class="summary-label">Fecha</span><span class="summary-value">${formatDate(state.date)}</span></div>
      <div class="summary-row"><span class="summary-label">Hora</span><span class="summary-value">${state.time}</span></div>
      <div class="summary-row"><span class="summary-label">Veterinario</span><span class="summary-value">${state.vet}</span></div>
      ${state.reason?`<div class="summary-row"><span class="summary-label">Motivo</span><span class="summary-value">${state.reason}</span></div>`:''}
    `;
  }

  // ── RESET ────────────────────────────────────────────────
  function resetState() {
    state={petType:'perro',petName:'',breed:'',age:'',sex:'',weight:'',ownerName:'',phone:'',email:'',date:'',time:'',vet:'',reason:''};
    document.querySelectorAll('#screen-1 input, #screen-1 select, #screen-1 textarea').forEach(el=>el.value='');
    document.getElementById('appt-date').value='';
    document.getElementById('time-section').style.display='none';
    document.querySelectorAll('.vet-card').forEach(c=>c.classList.remove('selected'));
    document.querySelectorAll('.service-card').forEach(c=>c.classList.remove('selected'));
    document.querySelectorAll('.vet-card').forEach(c=>c.classList.remove('selected'));
    document.querySelectorAll('.err-msg').forEach(e=>{e.textContent='';e.classList.remove('show');});
    document.querySelectorAll('input,select').forEach(e=>e.classList.remove('error'));
  }
  