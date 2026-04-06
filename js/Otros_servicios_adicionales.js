// Pre-llenar datos del usuario logueado si existen
    window.addEventListener('DOMContentLoaded', () => {
      const nombre = localStorage.getItem('tecnoUserFullName') || localStorage.getItem('tecnoUserName') || '';
      const tel    = localStorage.getItem('tecnoUserPhone') || '';
      if (nombre) document.getElementById('m-dueno').value = nombre;
      if (tel)    document.getElementById('m-tel').value   = tel;

      // Fecha mínima = hoy
      const hoy = new Date().toISOString().split('T')[0];
      document.getElementById('m-fecha').min = hoy;
    });

    // === Toggle tarjetas peluquería ===
    function toggleGrm(card) {
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.grm-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    }

    // === Modal ===
    let servicioSeleccionado = '';

    function abrirModal(servicio, e) {
      e.stopPropagation(); // no disparar el toggle de la tarjeta
      servicioSeleccionado = servicio;
      document.getElementById('modal-titulo').textContent = `Agendar: ${servicio}`;
      document.getElementById('modal-subtitulo').textContent = 'Completa los datos y te contactaremos para confirmar.';
      document.getElementById('modal-form').style.display = 'block';
      document.getElementById('modal-success').style.display = 'none';
      document.getElementById('modal-error').style.display = 'none';
      document.getElementById('modal-overlay').classList.add('open');
    }

    function cerrarModal() {
      document.getElementById('modal-overlay').classList.remove('open');
    }

    function cerrarModalFondo(e) {
      if (e.target === document.getElementById('modal-overlay')) cerrarModal();
    }

    function confirmarCita() {
      const pet    = document.getElementById('m-pet').value.trim();
      const dueno  = document.getElementById('m-dueno').value.trim();
      const tel    = document.getElementById('m-tel').value.trim();
      const fecha  = document.getElementById('m-fecha').value;
      const hora   = document.getElementById('m-hora').value;
      const err    = document.getElementById('modal-error');

      if (!pet || !dueno || !tel || !fecha || !hora) {
        err.textContent = '⚠️ Por favor completa todos los campos obligatorios.';
        err.style.display = 'block';
        return;
      }

      err.style.display = 'none';

      // Formatear fecha legible
      const [y, m, d] = fecha.split('-');
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const fechaLegible = `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;

      document.getElementById('success-msg').textContent =
        `${pet} tiene cita de "${servicioSeleccionado}" el ${fechaLegible} a las ${hora}. Te llamaremos al ${tel} para confirmar.`;

      document.getElementById('modal-form').style.display = 'none';
      document.getElementById('modal-success').style.display = 'block';
    }
