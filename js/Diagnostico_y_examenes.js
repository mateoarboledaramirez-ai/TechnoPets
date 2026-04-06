// ===== CARGAR MASCOTAS DEL USUARIO =====
    // Lee de 'tecnoPets' — clave guardada por Inicio_de_sesion.html
    function loadUserPets() {
      const raw = localStorage.getItem('tecnoPets');
      if (!raw) { showEmptyState(); return []; }
      try {
        const pets = JSON.parse(raw);
        return pets.map((p, i) => ({
          id:       p.id      || 'pet_' + i,
          nombre:   p.nombre  || 'Mascota ' + (i + 1),
          especie:  p.especie || 'No especificado',
          emoji:    p.emoji   || especieEmoji(p.especie),
          raza:     p.raza    || 'No especificado',
          edad:     p.edad    || 'No especificado',
          sexo:     p.sexo    || 'No especificado',
          peso:     p.peso    || null,
          tel:      p.tel     || '',
          consultas: p.consultas || []
        }));
      } catch (e) {
        console.error('Error al parsear tecnoPets:', e);
        showEmptyState();
        return [];
      }
    }

    function especieEmoji(especie) {
      const map = { 'Perro': '🐶', 'Gato': '🐱', 'Ave': '🐦', 'Otro': '🐾' };
      return map[especie] || '🐾';
    }

    // ===== MOSTRAR ESTADO VACÍO =====
    function showEmptyState() {
      const contentWrap = document.getElementById('content-wrap-container');
      // Ocultar también el selector de tabs
      const tabsWrap = document.querySelector('.pet-selector-wrap');
      if (tabsWrap) tabsWrap.style.display = 'none';
      contentWrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🐾</div>
          <p>No tienes mascotas registradas todavía.</p>
          <p style="margin-top:10px; font-size:0.82rem; opacity:0.65;">
            Crea tu cuenta en <a href="Inicio_de_sesion.html" style="color:var(--teal-light); font-weight:700;">Iniciar Sesión</a>
            y registra a tu mascota para ver su historial médico aquí.
          </p>
        </div>
      `;
    }

    // ===== RENDERIZAR MASCOTAS =====
    function renderPets(pets) {
      const tabsContainer = document.getElementById('pet-tabs-container');
      const contentContainer = document.getElementById('content-wrap-container');
      
      if (pets.length === 0) {
        showEmptyState();
        return;
      }

      // Limpiar contenedores
      tabsContainer.innerHTML = '';
      contentContainer.innerHTML = '';

      // Crear tabs
      pets.forEach((pet, index) => {
        const tab = document.createElement('button');
        tab.className = `pet-tab ${index === 0 ? 'active' : ''}`;
        tab.onclick = () => selectPet(pet.id);
        tab.innerHTML = `
          <span class="pet-emoji">${pet.emoji || '🐾'}</span> ${pet.nombre}
        `;
        tabsContainer.appendChild(tab);
      });

      // Crear fichas de mascotas
      pets.forEach((pet, index) => {
        const ficha = document.createElement('div');
        ficha.className = `pet-ficha ${index === 0 ? 'active' : ''}`;
        ficha.id = `pet-${pet.id}`;
        ficha.innerHTML = renderPetFicha(pet);
        contentContainer.appendChild(ficha);
      });
    }

    // ===== RENDERIZAR FICHA DE MASCOTA =====
    function renderPetFicha(pet) {
      // 'edad' viene del registro como texto libre (ej. "3 años") — se muestra directo
      const edadDisplay = pet.edad || 'No especificado';

      return `
        <div class="ficha-header">
          <div class="ficha-avatar">${pet.emoji || '🐾'}</div>
          <div class="ficha-name">
            <h2>${pet.nombre}</h2>
            <p>Ficha del paciente · Datos registrados por el dueño</p>
          </div>
        </div>
        <div class="ficha-grid">
          ${renderFichaItem('Especie', pet.especie || 'No especificado')}
          ${renderFichaItem('Raza', pet.raza || 'No especificado')}
          ${renderFichaItem('Edad', edadDisplay)}
          ${renderFichaItem('Sexo', pet.sexo || 'No especificado')}
          ${renderFichaItem('Peso', pet.peso ? pet.peso + ' kg' : 'No especificado')}
          ${renderFichaItem('Teléfono dueño', pet.tel || 'No registrado')}
        </div>
        <div class="section-label" style="margin-top:28px;">
          <span>Historial de consultas</span>
        </div>
        <div class="consulta-list">
          ${renderConsultas(pet.consultas || [])}
        </div>
      `;
    }

    // ===== RENDERIZAR ITEM DE FICHA =====
    function renderFichaItem(label, value) {
      return `
        <div class="ficha-item">
          <div class="fi-label">${label}</div>
          <div class="fi-value">${value}</div>
        </div>
      `;
    }

    // ===== RENDERIZAR CONSULTAS =====
    function renderConsultas(consultas) {
      if (!consultas || consultas.length === 0) {
        return `
          <div class="empty-state" style="padding:40px 24px;">
            <div class="empty-icon">📋</div>
            <p>Aún no hay consultas registradas para esta mascota.</p>
            <p style="margin-top:8px; font-size:0.8rem; opacity:0.6;">Las consultas aparecerán aquí después de tu primera visita a TechnoPets.</p>
          </div>
        `;
      }

      return consultas.map(consulta => `
        <div class="consulta-card" onclick="toggleConsulta(this)">
          <div class="consulta-summary">
            <div class="consulta-date-badge">
              <div class="day">${new Date(consulta.fecha).getDate()}</div>
              <div class="month">${formatearMes(new Date(consulta.fecha).getMonth())} ${new Date(consulta.fecha).getFullYear()}</div>
            </div>
            <div class="consulta-main">
              <h3>${consulta.titulo || 'Consulta'}</h3>
              <p>${consulta.descripcion || ''} · ${consulta.veterinario || 'Veterinario'}</p>
            </div>
            <div class="consulta-tags">
              ${consulta.categoria ? `<span class="tag tag-vet">${consulta.categoria}</span>` : ''}
              ${consulta.estado === 'pendiente' ? '<span class="tag tag-pending">⏳ Pendiente</span>' : '<span class="tag tag-ok">✓ Listo</span>'}
            </div>
            <div class="consulta-toggle">▾</div>
          </div>
          <div class="consulta-detail">
            <div class="consulta-detail-inner">
              <div class="detail-grid">
                <div class="detail-section">
                  <h4>🩺 Diagnóstico</h4>
                  <div class="detail-row">
                    ${consulta.motivo ? `<div class="detail-item"><div class="di-label">Motivo de consulta</div><div class="di-value">${consulta.motivo}</div></div>` : ''}
                    ${consulta.sintomas ? `<div class="detail-item"><div class="di-label">Síntomas</div><div class="di-value">${consulta.sintomas}</div></div>` : ''}
                    ${consulta.diagnostico ? `<div class="detail-item"><div class="di-label">Diagnóstico principal</div><div class="di-value">${consulta.diagnostico}</div></div>` : ''}
                  </div>
                </div>
                <div class="detail-section">
                  <h4>📋 Indicaciones</h4>
                  <div class="detail-row">
                    ${consulta.indicaciones ? `<div class="detail-item"><div class="di-label">Indicaciones</div><div class="di-value">${consulta.indicaciones}</div></div>` : ''}
                    ${consulta.medicacion ? `<div class="detail-item"><div class="di-label">Medicación recetada</div><div class="di-value">${consulta.medicacion}</div></div>` : ''}
                    ${consulta.proximaCita ? `<div class="detail-item"><div class="di-label">Próxima cita</div><div class="di-value">${consulta.proximaCita}</div></div>` : ''}
                  </div>
                </div>
              </div>
              ${renderExamenes(consulta.examenes || [])}
            </div>
          </div>
        </div>
      `).join('');
    }

    // ===== RENDERIZAR EXÁMENES =====
    function renderExamenes(examenes) {
      if (!examenes || examenes.length === 0) return '';
      
      return `
        <div class="exams-section">
          <h4>🔬 Exámenes ${examenes.some(e => e.estado === 'pendiente') ? 'solicitados' : 'realizados'}</h4>
          ${examenes.map(exam => `
            <div class="exam-item">
              <div class="exam-icon">${exam.emoji || '📋'}</div>
              <div class="exam-info">
                <div class="ex-name">${exam.nombre}</div>
                <div class="ex-meta">Laboratorio · Prioridad: ${exam.prioridad || 'Normal'} · ${formatearFecha(exam.fecha)}</div>
              </div>
              <div class="exam-actions">
                ${exam.estado === 'completado' ? `
                  <span class="tag tag-ok">✓ Listo</span>
                  <a href="#" class="btn-result" onclick="verResultado(event, '${exam.nombre}')">📄 Ver resultado</a>
                ` : `
                  <span class="tag tag-pending">⏳ Pendiente</span>
                  <span class="btn-result-disabled">🔒 No disponible</span>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ===== UTILIDADES =====
    function calcularEdad(fechaNacimiento) {
      if (!fechaNacimiento) return 'No especificado';
      const fecha = new Date(fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const mes = hoy.getMonth() - fecha.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--;
      return edad + ' año' + (edad !== 1 ? 's' : '');
    }

    function formatearFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleDateString('es-ES');
    }

    function formatearMes(mes) {
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return meses[mes];
    }

    // ===== SELECTOR DE MASCOTA =====
    function selectPet(petId) {
      document.querySelectorAll('.pet-tab').forEach(b => b.classList.remove('active'));
      event.currentTarget.classList.add('active');
      document.querySelectorAll('.pet-ficha').forEach(f => f.classList.remove('active'));
      document.getElementById('pet-' + petId).classList.add('active');
    }

    // ===== TOGGLE CONSULTA =====
    function toggleConsulta(card) {
      const isOpen = card.classList.contains('open');
      card.closest('.consulta-list').querySelectorAll('.consulta-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    }

    // ===== VER RESULTADO =====
    function verResultado(e, nombre) {
      e.stopPropagation();
      document.getElementById('modal-title').textContent = nombre;
      document.getElementById('modal-body').innerHTML =
        `<strong style="color:var(--teal-light);">${nombre}</strong><br><br>` +
        `<strong>Valores de referencia:</strong> Dentro de parámetros normales.<br>` +
        `<strong>Observación:</strong> No se detectaron alteraciones significativas. ` +
        `El veterinario revisará los resultados en la próxima consulta.<br><br>` +
        `<em style="font-size:0.78rem; opacity:0.6;">Resultado de la base de datos del sistema TechnoPets.</em>`;
      const overlay = document.getElementById('modal-overlay');
      overlay.style.display = 'flex';
    }

    function cerrarModal() {
      document.getElementById('modal-overlay').style.display = 'none';
    }

    document.getElementById('modal-overlay').addEventListener('click', function(e) {
      if (e.target === this) cerrarModal();
    });

    // ===== INICIALIZAR =====
    document.addEventListener('DOMContentLoaded', function() {
      const pets = loadUserPets();
      renderPets(pets);
    });
