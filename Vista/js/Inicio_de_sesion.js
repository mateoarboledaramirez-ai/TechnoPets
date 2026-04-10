// ======= ESTADO =======
    let petCount = 1;
    let sameSpecies = true;
    let globalSpecies = { name: 'Perro', emoji: '🐶' };
    let currentPetIndex = 0;
    let pets = [];

    // ======= HELPERS =======
    const statusEl = document.getElementById('status-message');

    function setStatus(text, type = 'error') {
      statusEl.style.display = 'block';
      statusEl.style.color   = type === 'success' ? '#52b788' : '#ffb703';
      statusEl.style.background = type === 'success' ? 'rgba(82,183,136,0.1)' : 'rgba(255,183,3,0.08)';
      statusEl.textContent = text;
    }

    function clearStatus() {
      statusEl.style.display = 'none';
      statusEl.textContent   = '';
    }

    function togglePass(id, btn) {
      const input = document.getElementById(id);
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    }

    function validateEmail(v) { return /^\S+@\S+\.\S+$/.test(v); }
    function validatePhone(v) { return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v); }

    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach((b, i) =>
        b.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'))
      );
      document.getElementById('form-login').classList.toggle('active', tab === 'login');
      document.getElementById('form-register').classList.toggle('active', tab === 'register');
      clearStatus();
    }

    // ======= LOGIN =======
    document.getElementById('form-login').addEventListener('submit', e => {
      e.preventDefault();
      clearStatus();
      const user = document.getElementById('login-usuario').value.trim();
      const pass = document.getElementById('login-password').value;
      const btn  = document.getElementById('btn-login');

      if (!user || !pass) return setStatus('⚠️ Completa todos los campos');

      const savedEmail = localStorage.getItem('tecnoUserEmail') || '';
      const savedName  = localStorage.getItem('tecnoUserName')  || '';
      const savedPass  = localStorage.getItem('tecnoUserPassword') || '';

      if (!savedPass) return setStatus('⚠️ No hay cuenta registrada. Crea una primero.');
      if (user !== savedEmail && user !== savedName) return setStatus('⚠️ Usuario no encontrado');
      if (pass !== savedPass) return setStatus('❌ Contraseña incorrecta');

      btn.textContent = '✅ Accediendo...';
      btn.style.background = 'linear-gradient(135deg,#2d6a4f,#52b788)';
      setStatus('¡Bienvenido/a! Redirigiendo... 🐾', 'success');
      setTimeout(() => { window.location.href = 'Pagina_Principal.html'; }, 900);
    });

    // ======= PASO 1 → 2 =======
    function goStep2() {
      clearStatus();
      const nombre  = document.getElementById('reg-nombre').value.trim();
      const correo  = document.getElementById('reg-correo').value.trim();
      const telefono = document.getElementById('reg-telefono').value.trim();
      const pass    = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;

      if (!nombre || !correo || !pass || !confirm) return setStatus('⚠️ Completa todos los campos');
      if (!validateEmail(correo)) return setStatus('⚠️ Ingresa un correo válido');
      if (telefono && !validatePhone(telefono)) return setStatus('⚠️ Ingresa un número de teléfono válido');
      if (pass.length < 6) return setStatus('⚠️ La contraseña debe tener mínimo 6 caracteres');
      if (pass !== confirm) return setStatus('⚠️ Las contraseñas no coinciden');

      show('step-2'); hide('step-1'); clearStatus();
    }

    // ======= CONTADOR =======
    function changePetCount(delta) {
      petCount = Math.max(1, Math.min(10, petCount + delta));
      document.getElementById('pet-count-display').textContent = petCount;
    }

    // ======= MISMA/DIFERENTE ESPECIE =======
    function selectSameSpecies(same, btn) {
      sameSpecies = same;
      document.querySelectorAll('#step-2 .species-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('same-species-picker').style.display = same ? 'block' : 'none';
    }

    function selectGlobalSpecies(name, emoji, btn) {
      globalSpecies = { name, emoji };
      document.querySelectorAll('#same-species-picker .pet-type-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    }

    // ======= PASO 2 → 3 =======
    function goStep3() {
      // Inicializar array de mascotas
      pets = Array.from({ length: petCount }, () => ({
        especie: globalSpecies.name,
        emoji:   globalSpecies.emoji,
        nombre: '', raza: '', edad: '', sexo: '', peso: '', tel: ''
      }));
      currentPetIndex = 0;
      renderPetForm(0);
      show('step-3'); hide('step-2'); clearStatus();
    }

    // ======= RENDERIZAR FORMULARIO DE MASCOTA =======
    function renderPetForm(idx) {
      const num   = idx + 1;
      const total = petCount;
      const pet   = pets[idx];

      document.getElementById('step3-title').textContent     = `Registrar mascota ${num}`;
      document.getElementById('pet-card-num').textContent    = `${pet.emoji} Mascota ${num}`;
      document.getElementById('pet-card-progress').textContent = `${num} de ${total}`;

      // Mostrar selector de especie solo si son diferentes
      document.getElementById('pet-type-selector').style.display = sameSpecies ? 'none' : 'block';

      // Marcar especie actual en el selector individual
      if (!sameSpecies) {
        document.querySelectorAll('#individual-species .pet-type-btn').forEach(b => {
          const label = b.querySelector('span:last-child').textContent;
          b.classList.toggle('selected', label === pet.especie);
        });
      }

      // Rellenar campos guardados
      document.getElementById('pet-nombre').value = pet.nombre;
      document.getElementById('pet-raza').value   = pet.raza;
      document.getElementById('pet-edad').value   = pet.edad;
      document.getElementById('pet-sexo').value   = pet.sexo;
      document.getElementById('pet-peso').value   = pet.peso;
      document.getElementById('owner-tel').value  = pet.tel;

      // Datos dueño (pre-relleno de paso 1, todos readonly)
      document.getElementById('owner-nombre').value = document.getElementById('reg-nombre').value.trim();
      document.getElementById('owner-email').value  = document.getElementById('reg-correo').value.trim();
      document.getElementById('owner-tel').value    = document.getElementById('reg-telefono').value.trim();

      // Botones
      const backBtn = document.getElementById('btn-back-pets');
      const nextBtn = document.getElementById('btn-next-pet');
      backBtn.textContent = idx === 0 ? '← Atrás' : '← Anterior';
      nextBtn.textContent = num === total ? '✓ Finalizar registro' : 'Siguiente mascota →';
      nextBtn.disabled = false;
    }

    function selectIndividualSpecies(name, emoji, btn) {
      pets[currentPetIndex].especie = name;
      pets[currentPetIndex].emoji   = emoji;
      document.querySelectorAll('#individual-species .pet-type-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('pet-card-num').textContent = `${emoji} Mascota ${currentPetIndex + 1}`;
    }

    function savePetData(idx) {
      pets[idx].nombre = document.getElementById('pet-nombre').value.trim();
      pets[idx].raza   = document.getElementById('pet-raza').value.trim();
      pets[idx].edad   = document.getElementById('pet-edad').value.trim();
      pets[idx].sexo   = document.getElementById('pet-sexo').value;
      pets[idx].peso   = document.getElementById('pet-peso').value.trim();
      pets[idx].tel    = document.getElementById('reg-telefono').value.trim();
    }

    function nextPet() {
      clearStatus();
      if (!document.getElementById('pet-nombre').value.trim())
        return setStatus('⚠️ El nombre de la mascota es obligatorio');

      savePetData(currentPetIndex);

      if (currentPetIndex + 1 < petCount) {
        currentPetIndex++;
        renderPetForm(currentPetIndex);
      } else {
        // Guardar todo
        const nombre = document.getElementById('reg-nombre').value.trim();
        const correo = document.getElementById('reg-correo').value.trim();
        const telefono = document.getElementById('reg-telefono').value.trim();
        const pass   = document.getElementById('reg-password').value;

        localStorage.setItem('tecnoUserFullName', nombre);
        localStorage.setItem('tecnoUserName', nombre);
        localStorage.setItem('tecnoUserEmail', correo);
        localStorage.setItem('tecnoUserPhone', telefono);
        localStorage.setItem('tecnoUserPassword', pass);
        localStorage.setItem('tecnoPets', JSON.stringify(pets));

        setStatus(`✅ ¡Registro completo! ${petCount} mascota(s) guardada(s)`, 'success');
        document.getElementById('btn-next-pet').textContent = '✅ ¡Todo listo!';
        document.getElementById('btn-next-pet').disabled = true;

        setTimeout(() => {
          // Resetear todo
          pets = []; petCount = 1; currentPetIndex = 0; sameSpecies = true;
          globalSpecies = { name: 'Perro', emoji: '🐶' };
          ['reg-nombre','reg-correo','reg-telefono','reg-password','reg-confirm'].forEach(id => document.getElementById(id).value = '');
          document.getElementById('pet-count-display').textContent = '1';
          hide('step-3'); show('step-1');
          switchTab('login');
          clearStatus();
          setTimeout(() => setStatus('✅ Cuenta creada. ¡Ahora inicia sesión!', 'success'), 100);
        }, 1600);
      }
    }

    function backPet() {
      savePetData(currentPetIndex);
      if (currentPetIndex === 0) {
        hide('step-3'); show('step-2'); clearStatus();
      } else {
        currentPetIndex--;
        renderPetForm(currentPetIndex);
        clearStatus();
      }
    }

    function backStep(step) {
      if (step === 1) { hide('step-2'); show('step-1'); clearStatus(); }
    }

    function show(id) { document.getElementById(id).style.display = 'block'; }
    function hide(id) { document.getElementById(id).style.display = 'none'; }
