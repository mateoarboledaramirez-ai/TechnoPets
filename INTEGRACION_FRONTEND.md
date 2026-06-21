# 📡 Guía de Integración Frontend - API

Esta guía muestra cómo conectar las páginas HTML con los endpoints del backend.

---

## 📋 Estructura Básica para Cualquier Página

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi Página</title>
  <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
  <!-- Contenido -->
  <header>
    <h1>Mi Página</h1>
    <button data-logout>Cerrar Sesión</button>
  </header>

  <!-- Scripts -->
  <script src="/Vista/js/auth.js"></script>
  <script src="/Vista/js/api-client.js"></script>
  <script>
    // Inicializar autenticación
    const usuario = inicializarPagina();
    configurarLogout();
    
    console.log('Usuario:', usuario);
  </script>
</body>
</html>
```

---

## 🐕 Ejemplo 1: Página de Mascotas

**Archivo:** `Vista/mis-mascotas.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mis Mascotas</title>
  <style>
    body { font-family: Arial; margin: 20px; }
    .mascota-card { border: 1px solid #ccc; padding: 15px; margin: 10px 0; }
    .btngroup { margin-top: 10px; }
    button { padding: 8px 15px; margin: 5px; cursor: pointer; }
    .success { color: green; }
    .error { color: red; }
    #lista-mascotas { display: grid; gap: 10px; }
  </style>
</head>
<body>
  <header>
    <h1>Mis Mascotas 🐾</h1>
    <p>Usuario: <strong id="usuario-correo"></strong></p>
    <button data-logout style="float: right;">Logout</button>
  </header>

  <main>
    <button id="btn-agregar">+ Agregar Nueva Mascota</button>
    <div id="mensaje"></div>

    <h2>Mis Mascotas</h2>
    <div id="lista-mascotas">
      <p>Cargando...</p>
    </div>
  </main>

  <!-- Modal para agregar mascota -->
  <div id="modal-agregar" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);">
    <div style="background: white; padding: 30px; margin: auto; margin-top: 50px; width: 90%; max-width: 500px; border-radius: 10px;">
      <h2>Agregar Nueva Mascota</h2>
      <form id="form-mascota">
        <input type="text" id="m-nombre" placeholder="Nombre" required>
        <select id="m-especie" required>
          <option value="">Selecciona especie</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
        </select>
        <input type="text" id="m-raza" placeholder="Raza" required>
        <input type="number" id="m-edad" placeholder="Edad (años)" min="0" max="50" required>
        <select id="m-sexo" required>
          <option value="">Selecciona sexo</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>
        <input type="text" id="m-peso" placeholder="Peso (ej: 25kg)" required>
        <div style="margin-top: 15px;">
          <button type="submit">Guardar Mascota</button>
          <button type="button" onclick="cerrarModal()">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <script src="/Vista/js/auth.js"></script>
  <script src="/Vista/js/api-client.js"></script>
  <script>
    const usuario = inicializarPagina();
    configurarLogout();

    document.getElementById('usuario-correo').textContent = usuario.correo;

    // Cargar mascotas al iniciar
    async function cargarMascotas() {
      const datos = await obtenerMascotas();
      const lista = document.getElementById('lista-mascotas');

      if (!datos.success) {
        lista.innerHTML = '<p class="error">Error: ' + datos.mensaje + '</p>';
        return;
      }

      if (datos.mascotas.length === 0) {
        lista.innerHTML = '<p>No tienes mascotas registradas. ¡Agrega una!</p>';
        return;
      }

      lista.innerHTML = datos.mascotas.map(m => `
        <div class="mascota-card">
          <h3>${m.nombre_mascota} ${m.especie === 'perro' ? '🐕' : '🐈'}</h3>
          <p><strong>Especie:</strong> ${m.especie}</p>
          <p><strong>Raza:</strong> ${m.raza}</p>
          <p><strong>Edad:</strong> ${m.edad} años</p>
          <p><strong>Sexo:</strong> ${m.sexo}</p>
          <p><strong>Peso:</strong> ${m.peso}</p>
          <div class="btngroup">
            <button onclick="editarMascota(${m.id_mascota})">Editar</button>
            <button onclick="eliminarMascota(${m.id_mascota})">Eliminar</button>
            <button onclick="verHistorial(${m.id_mascota})">Ver Historial</button>
          </div>
        </div>
      `).join('');
    }

    // Agregar mascota
    document.getElementById('btn-agregar').addEventListener('click', () => {
      document.getElementById('modal-agregar').style.display = 'block';
    });

    function cerrarModal() {
      document.getElementById('modal-agregar').style.display = 'none';
    }

    document.getElementById('form-mascota').addEventListener('submit', async (e) => {
      e.preventDefault();

      const resultado = await crearMascota(
        document.getElementById('m-nombre').value,
        document.getElementById('m-especie').value,
        document.getElementById('m-raza').value,
        document.getElementById('m-edad').value,
        document.getElementById('m-sexo').value,
        document.getElementById('m-peso').value
      );

      const msg = document.getElementById('mensaje');
      if (resultado.success) {
        mostrarMensaje(msg, '✅ ' + resultado.mensaje, 'success');
        document.getElementById('form-mascota').reset();
        cerrarModal();
        cargarMascotas();
      } else {
        mostrarMensaje(msg, '❌ ' + resultado.mensaje, 'error');
      }
    });

    async function editarMascota(id) {
      const nombre = prompt('Nuevo nombre:');
      if (!nombre) return;

      const resultado = await editarMascota(id, { nombre });
      const msg = document.getElementById('mensaje');
      
      if (resultado.success) {
        mostrarMensaje(msg, '✅ Mascota actualizada', 'success');
        cargarMascotas();
      } else {
        mostrarMensaje(msg, '❌ ' + resultado.mensaje, 'error');
      }
    }

    async function eliminarMascota(id) {
      if (!confirm('¿Eliminar esta mascota?')) return;

      const resultado = await eliminarMascota(id);
      const msg = document.getElementById('mensaje');
      
      if (resultado.success) {
        mostrarMensaje(msg, '✅ Mascota eliminada', 'success');
        cargarMascotas();
      } else {
        mostrarMensaje(msg, '❌ ' + resultado.mensaje, 'error');
      }
    }

    async function verHistorial(id) {
      const datos = await obtenerHistorialMedico(id);
      if (datos.success) {
        alert('Consultas: ' + datos.cantidad_consultas);
        // Abrir página de historial o modal
      }
    }

    // Cargar mascotas al iniciar
    cargarMascotas();
  </script>
</body>
</html>
```

---

## 📅 Ejemplo 2: Agendar Cita

**Archivo:** `Vista/agendar-cita.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Agendar Cita</title>
  <style>
    body { font-family: Arial; margin: 20px; max-width: 600px; }
    form { background: #f5f5f5; padding: 20px; border-radius: 10px; }
    label { display: block; margin: 15px 0 5px 0; font-weight: bold; }
    input, select { width: 100%; padding: 10px; margin-bottom: 15px; }
    button { background: #2d6a4f; color: white; padding: 10px 20px; cursor: pointer; }
    .success { color: green; font-weight: bold; }
    .error { color: red; }
  </style>
</head>
<body>
  <header>
    <h1>Agendar Nueva Cita 📅</h1>
    <button data-logout style="float: right;">Logout</button>
  </header>

  <form id="form-cita">
    <label>
      Selecciona tu mascota:
      <select id="mascota" required>
        <option value="">Cargando mascotas...</option>
      </select>
    </label>

    <label>
      Fecha:
      <input type="date" id="fecha" required>
    </label>

    <label>
      Veterinario:
      <select id="veterinario" required>
        <option value="">Cargando veterinarios...</option>
      </select>
    </label>

    <label>
      Hora disponible:
      <select id="hora" required>
        <option value="">Selecciona veterinario y fecha primero</option>
      </select>
    </label>

    <label>
      Motivo de la consulta:
      <select id="motivo" required>
        <option value="">Cargando motivos...</option>
      </select>
    </label>

    <div id="mensaje"></div>

    <button type="submit">Agendar Cita</button>
    <button type="reset">Limpiar</button>
  </form>

  <script src="/Vista/js/auth.js"></script>
  <script src="/Vista/js/api-client.js"></script>
  <script>
    inicializarPagina();
    configurarLogout();

    // Cargar mascotas
    async function cargarMascotas() {
      const datos = await obtenerMascotas();
      if (datos.success && datos.mascotas.length > 0) {
        document.getElementById('mascota').innerHTML = datos.mascotas.map(m =>
          `<option value="${m.id_mascota}">${m.nombre_mascota}</option>`
        ).join('');
      }
    }

    // Cargar veterinarios
    async function cargarVeterinarios() {
      const datos = await obtenerVeterinarios();
      if (datos.success && datos.veterinarios.length > 0) {
        document.getElementById('veterinario').innerHTML = datos.veterinarios.map(v =>
          `<option value="${v.id_veterinario}">${v.nombre_veterinario} (${v.especialidad})</option>`
        ).join('');
      }
    }

    // Cargar motivos
    async function cargarMotivos() {
      const datos = await obtenerMotivosConsulta();
      if (datos.success && datos.motivos.length > 0) {
        document.getElementById('motivo').innerHTML = datos.motivos.map(m =>
          `<option value="${m.id_motivo}">${m.motivo}</option>`
        ).join('');
      }
    }

    // Cargar disponibilidad
    document.getElementById('veterinario').addEventListener('change', async () => {
      const vet = document.getElementById('veterinario').value;
      const fecha = document.getElementById('fecha').value;

      if (!vet || !fecha) {
        document.getElementById('hora').innerHTML = '<option>Selecciona veterinario y fecha</option>';
        return;
      }

      const datos = await obtenerDisponibilidad(parseInt(vet), fecha);
      if (datos.success && datos.horas_disponibles.length > 0) {
        document.getElementById('hora').innerHTML = datos.horas_disponibles.map(h =>
          `<option value="${h}">${h}</option>`
        ).join('');
      } else {
        document.getElementById('hora').innerHTML = '<option>No hay horas disponibles</option>';
      }
    });

    document.getElementById('fecha').addEventListener('change', async () => {
      const vet = document.getElementById('veterinario').value;
      if (vet) {
        document.getElementById('veterinario').dispatchEvent(new Event('change'));
      }
    });

    // Agendar cita
    document.getElementById('form-cita').addEventListener('submit', async (e) => {
      e.preventDefault();

      const resultado = await agendarCita(
        parseInt(document.getElementById('mascota').value),
        document.getElementById('fecha').value,
        document.getElementById('hora').value,
        parseInt(document.getElementById('motivo').value),
        parseInt(document.getElementById('veterinario').value)
      );

      const msg = document.getElementById('mensaje');
      if (resultado.success) {
        mostrarMensaje(msg, '✅ Cita agendada exitosamente', 'success');
        document.getElementById('form-cita').reset();
        cargarMascotas();
        setTimeout(() => {
          window.location.href = '/Vista/mis-citas.html';
        }, 2000);
      } else {
        mostrarMensaje(msg, '❌ ' + resultado.mensaje, 'error');
      }
    });

    // Inicializar
    cargarMascotas();
    cargarVeterinarios();
    cargarMotivos();
  </script>
</body>
</html>
```

---

## 🔍 Ejemplo 3: Ver Historial Médico

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Historial Médico</title>
</head>
<body>
  <h1>Historial Médico</h1>
  <select id="mascota-select">
    <option value="">Selecciona una mascota</option>
  </select>
  <div id="historial"></div>

  <script src="/Vista/js/auth.js"></script>
  <script src="/Vista/js/api-client.js"></script>
  <script>
    inicializarPagina();

    // Cargar mascotas
    async function cargarMascotas() {
      const datos = await obtenerMascotas();
      if (datos.success) {
        document.getElementById('mascota-select').innerHTML += datos.mascotas.map(m =>
          `<option value="${m.id_mascota}">${m.nombre_mascota}</option>`
        ).join('');
      }
    }

    // Cargar historial
    document.getElementById('mascota-select').addEventListener('change', async (e) => {
      const id = e.target.value;
      if (!id) return;

      const datos = await obtenerHistorialMedico(id);
      if (datos.success && datos.historial.length > 0) {
        document.getElementById('historial').innerHTML = datos.historial.map(c => `
          <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
            <p><strong>Fecha:</strong> ${formatearFechaHora(c.fecha, c.hora)}</p>
            <p><strong>Veterinario:</strong> ${c.nombre_veterinario}</p>
            <p><strong>Temperatura:</strong> ${c.temperatura}°C</p>
            <p><strong>Diagnóstico:</strong> ${c.diagnostico || '-'}</p>
            <p><strong>Tratamiento:</strong> ${c.tratamiento || '-'}</p>
            <p><strong>Observaciones:</strong> ${c.observacion || '-'}</p>
          </div>
        `).join('');
      } else {
        document.getElementById('historial').innerHTML = '<p>Sin historial médico</p>';
      }
    });

    cargarMascotas();
  </script>
</body>
</html>
```

---

## 🎓 Checklist de Integración

Para cada página HTML, asegúrate de:

- [ ] Incluir `<script src="/Vista/js/auth.js"></script>`
- [ ] Incluir `<script src="/Vista/js/api-client.js"></script>`
- [ ] Llamar `inicializarPagina()` al cargar
- [ ] Usar funciones de `api-client.js` para solicitudes
- [ ] Mostrar/ocultar elementos según datos
- [ ] Manejar errores adecuadamente
- [ ] Tener botón logout con `data-logout`

---

## 🔧 Funciones Disponibles en api-client.js

### Mascotas
- `obtenerMascotas()` - GET /api/mascotas
- `obtenerMascota(id)` - GET /api/mascotas/<id>
- `crearMascota(...)` - POST /api/mascotas
- `editarMascota(id, datos)` - PUT /api/mascotas/<id>
- `eliminarMascota(id)` - DELETE /api/mascotas/<id>

### Citas
- `obtenerCitas()` - GET /api/citas
- `obtenerCita(id)` - GET /api/citas/<id>
- `agendarCita(...)` - POST /api/citas/agendar
- `modificarCita(id, datos)` - PUT /api/citas/<id>
- `cancelarCita(id, motivo)` - POST /api/citas/<id>/cancelar
- `obtenerMotivosConsulta()` - GET /api/citas/motivos
- `obtenerVeterinarios()` - GET /api/citas/veterinarios
- `obtenerDisponibilidad(vet, fecha)` - GET /api/citas/disponibilidad

### Consultas Médicas
- `obtenerHistorialMedico(id)` - GET /api/consultas/<id>
- `registrarConsulta(...)` - POST /api/consultas
- `obtenerDiagnosticos()` - GET /api/consultas/diagnosticos
- `obtenerTratamientos()` - GET /api/consultas/tratamientos

### Helpers
- `mostrarMensaje(elem, texto, tipo)` - Muestra mensaje
- `limpiarMensaje(elem)` - Limpia mensaje
- `formatearFecha(fecha)` - Formatea fecha
- `formatearHora(hora)` - Formatea hora
- `validarEmail(email)` - Valida email
- `validarFecha(fecha)` - Valida fecha
- `validarHora(hora)` - Valida hora

---

¡Listo para crear tus páginas conectadas! 🚀
