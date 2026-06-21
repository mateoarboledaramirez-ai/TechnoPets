# 🛠️ Guía de Integración - Sistema de Autenticación

Esta guía muestra cómo usar el sistema de autenticación en tus páginas HTML.

---

## 1️⃣ Estructura Básica de una Página Protegida

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Página Protegida</title>
  <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
  <!-- Contenido de la página -->
  <header>
    <h1>Bienvenido <span class="usuario-nombre">Usuario</span></h1>
    <button id="btn-logout">Cerrar Sesión</button>
  </header>

  <main>
    <h2>Mi Perfil</h2>
    <p>Correo: <span id="usuario-correo">-</span></p>
    <p>Rol: <span class="usuario-rol">-</span></p>
  </main>

  <!-- Scripts -->
  <script src="/Vista/js/auth.js"></script>
  <script>
    // Verificar autenticación y actualizar UI
    inicializarAutenticacion();
    
    // Configurar botón de logout
    configurarBtnLogout('btn-logout');
    
    // Mostrar correo del usuario
    document.getElementById('usuario-correo').textContent = obtenerCorreoUsuario();
  </script>
</body>
</html>
```

---

## 2️⃣ Ejemplo: Página de Mascotas

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mis Mascotas</title>
</head>
<body>
  <header>
    <h1>Mis Mascotas</h1>
    <p>Usuario: <span class="usuario-nombre"></span></p>
    <button id="btn-logout">Logout</button>
  </header>

  <main>
    <button id="btn-agregar-mascota">+ Agregar Mascota</button>
    <div id="lista-mascotas"></div>
  </main>

  <script src="/Vista/js/auth.js"></script>
  <script>
    // Inicializar autenticación
    inicializarAutenticacion();
    configurarBtnLogout('btn-logout');

    // Cargar mascotas del usuario
    async function cargarMascotas() {
      const datos = await llamarAPI('/mascotas');
      
      if (datos.success) {
        const lista = document.getElementById('lista-mascotas');
        lista.innerHTML = datos.mascotas.map(mascota => `
          <div class="mascota-card">
            <h3>${mascota.nombre_mascota}</h3>
            <p>Especie: ${mascota.especie}</p>
            <p>Raza: ${mascota.raza}</p>
            <p>Edad: ${mascota.edad} años</p>
            <button onclick="verMascota(${mascota.id_mascota})">Ver Detalles</button>
          </div>
        `).join('');
      } else {
        console.error('Error:', datos.mensaje);
      }
    }

    // Agregar mascota
    document.getElementById('btn-agregar-mascota').addEventListener('click', async () => {
      const nombre = prompt('Nombre de la mascota:');
      if (!nombre) return;

      const datos = await llamarAPI('/mascotas', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombre,
          especie: 'perro',
          raza: 'No especificada',
          edad: 1,
          sexo: 'M',
          peso: '0kg'
        })
      });

      if (datos.success) {
        alert('Mascota agregada');
        cargarMascotas();
      } else {
        alert('Error: ' + datos.mensaje);
      }
    });

    // Cargar mascotas al iniciar
    cargarMascotas();
  </script>
</body>
</html>
```

---

## 3️⃣ Ejemplo: Dashboard con Rol Específico

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard Veterinario</title>
</head>
<body>
  <header>
    <h1>Dashboard Veterinario</h1>
    <p>Rol: <span class="usuario-rol"></span></p>
    <button id="btn-logout">Logout</button>
  </header>

  <!-- Visible solo para veterinarios -->
  <main id="dashboard-veterinario" style="display:none;">
    <h2>Citas de Hoy</h2>
    <div id="citas-hoy"></div>

    <h2>Historial Médico</h2>
    <div id="historial"></div>
  </main>

  <!-- Visible para otros roles -->
  <div id="sin-acceso" style="display:none;">
    <h2>Acceso Denegado</h2>
    <p>No tienes permisos para ver este contenido</p>
  </div>

  <script src="/Vista/js/auth.js"></script>
  <script>
    // Verificar que es veterinario
    inicializarAutenticacionConRol('veterinario');
    configurarBtnLogout('btn-logout');

    // Mostrar dashboard
    document.getElementById('dashboard-veterinario').style.display = 'block';

    // Cargar citas
    async function cargarCitas() {
      const datos = await llamarAPI('/citas');
      if (datos.success) {
        document.getElementById('citas-hoy').innerHTML = datos.citas
          .map(c => `
            <div class="cita-card">
              <p>Hora: ${c.hora}</p>
              <p>Mascota: ${c.nombre_mascota}</p>
              <p>Dueño: ${c.nombre_dueño}</p>
              <button onclick="verCita(${c.id_cita})">Ver</button>
            </div>
          `).join('');
      }
    }

    cargarCitas();
  </script>
</body>
</html>
```

---

## 4️⃣ Mostrar/Ocultar Elementos Según Autenticación

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página Mixta</title>
</head>
<body>
  <!-- Visible solo si está autenticado -->
  <nav class="navbar-autenticado" style="display:none;">
    <a href="/Vista/mis-mascotas.html">Mis Mascotas</a>
    <a href="/Vista/mis-citas.html">Mis Citas</a>
    <button id="btn-logout">Logout</button>
  </nav>

  <!-- Visible solo si NO está autenticado -->
  <nav class="navbar-publico">
    <a href="/Vista/Inicio_de_sesion.html#login">Login</a>
    <a href="/Vista/Inicio_de_sesion.html#registro">Registrarse</a>
  </nav>

  <main>
    <h1>Página Principal</h1>

    <!-- Sección solo para autenticados -->
    <section class="seccion-privada" style="display:none;">
      <h2>Mi Dashboard</h2>
      <p>Bienvenido <span class="usuario-nombre"></span></p>
    </section>

    <!-- Sección pública -->
    <section class="seccion-publica">
      <h2>Sobre TechnoPets</h2>
      <p>Sistema de gestión veterinaria...</p>
    </section>
  </main>

  <script src="/Vista/js/auth.js"></script>
  <script>
    // Actualizar UI según autenticación
    if (estaAutenticado()) {
      // Mostrar elementos autenticados
      mostrarSiAutenticado('.navbar-autenticado');
      mostrarSiAutenticado('.seccion-privada');
      ocultarSiAutenticado('.navbar-publico');
      
      // Actualizar nombres
      actualizarUIAutenticacion();
      configurarBtnLogout('btn-logout');
    } else {
      // Mostrar elementos públicos
      ocultarSiAutenticado('.navbar-autenticado');
      ocultarSiAutenticado('.seccion-privada');
      mostrarSiAutenticado('.navbar-publico');
    }
  </script>
</body>
</html>
```

---

## 5️⃣ Ejemplo: Formulario con Solicitud Autenticada

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Agendar Cita</title>
</head>
<body>
  <h1>Agendar Cita</h1>

  <form id="form-cita">
    <label>
      Mascota:
      <select id="mascota" required>
        <option value="">Selecciona una mascota</option>
      </select>
    </label>

    <label>
      Fecha:
      <input type="date" id="fecha" required>
    </label>

    <label>
      Hora:
      <input type="time" id="hora" required>
    </label>

    <label>
      Motivo:
      <textarea id="motivo" required></textarea>
    </label>

    <button type="submit">Agendar Cita</button>
    <span id="mensaje"></span>
  </form>

  <script src="/Vista/js/auth.js"></script>
  <script>
    // Verificar autenticación
    inicializarAutenticacion();

    // Cargar mascotas del usuario
    async function cargarMascotas() {
      const datos = await llamarAPI('/mascotas');
      if (datos.success) {
        const select = document.getElementById('mascota');
        datos.mascotas.forEach(m => {
          const option = document.createElement('option');
          option.value = m.id_mascota;
          option.textContent = m.nombre_mascota;
          select.appendChild(option);
        });
      }
    }

    // Manejar envío de formulario
    document.getElementById('form-cita').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const mensaje = document.getElementById('mensaje');
      mensaje.textContent = '⏳ Agendando...';

      const datos = await llamarAPI('/citas/agendar', {
        method: 'POST',
        body: JSON.stringify({
          id_mascota: document.getElementById('mascota').value,
          fecha: document.getElementById('fecha').value,
          hora: document.getElementById('hora').value,
          motivo: document.getElementById('motivo').value
        })
      });

      if (datos.success) {
        mensaje.textContent = '✅ Cita agendada correctamente';
        document.getElementById('form-cita').reset();
      } else {
        mensaje.textContent = '❌ ' + datos.mensaje;
      }
    });

    cargarMascotas();
  </script>
</body>
</html>
```

---

## 6️⃣ Manejo de Errores y Timeouts

```javascript
// Función mejorada con manejo de errores
async function llamarAPIConReintentos(endpoint, opciones = {}, reintentos = 3) {
  let intento = 0;
  
  while (intento < reintentos) {
    try {
      const respuesta = await llamarAPI(endpoint, opciones);
      
      if (respuesta.success) {
        return respuesta;
      } else if (respuesta.status === 401) {
        // Token expirado
        console.warn('Token expirado, redirigiendo a login...');
        eliminarToken();
        window.location.href = '/Vista/Inicio_de_sesion.html';
        return null;
      } else {
        throw new Error(respuesta.mensaje);
      }
    } catch (error) {
      intento++;
      if (intento >= reintentos) {
        console.error('Error después de', reintentos, 'intentos:', error);
        return { success: false, mensaje: 'Error de conexión' };
      }
      // Esperar 1 segundo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Usar función con reintentos
const datos = await llamarAPIConReintentos('/usuario/perfil', {}, 3);
```

---

## 7️⃣ Checklist de Integración

Cuando integres la autenticación en una página:

- [ ] Incluir `<script src="/Vista/js/auth.js"></script>`
- [ ] Llamar `inicializarAutenticacion()` al cargar la página
- [ ] Usar `llamarAPI()` para todas las solicitudes autenticadas
- [ ] Mostrar/ocultar elementos según `estaAutenticado()`
- [ ] Mostrar/ocultar elementos según `tieneRol(rol)`
- [ ] Configurar botón logout con `configurarBtnLogout(id)`
- [ ] Actualizar UI con `actualizarUIAutenticacion()`
- [ ] Manejar errores 401 (token expirado)

---

## 📞 Funciones Disponibles en auth.js

### Tokens
- `obtenerToken()` - Obtiene token JWT
- `guardarToken(token)` - Guarda token
- `eliminarToken()` - Elimina token (logout)
- `tieneTokenValido()` - Verifica si token existe

### Usuario
- `obtenerUsuario()` - Obtiene datos de usuario
- `obtenerIdUsuario()` - Obtiene ID de usuario
- `obtenerCorreoUsuario()` - Obtiene correo
- `obtenerRolUsuario()` - Obtiene rol
- `estaAutenticado()` - Verifica autenticación

### Solicitudes
- `llamarAPI(endpoint, opciones)` - Solicitud autenticada

### Autorización
- `tieneRol(rol)` - Verifica rol específico
- `tieneAlgunRol(...roles)` - Verifica varios roles
- `requiereAutenticacion()` - Redirige si no autenticado
- `requiereRol(rol)` - Redirige si no tiene rol

### UI
- `actualizarUIAutenticacion()` - Actualiza elementos .usuario-*
- `configurarBtnLogout(id)` - Configura botón logout
- `mostrarSiAutenticado(selector)` - Muestra si autenticado
- `ocultarSiAutenticado(selector)` - Oculta si autenticado
- `mostrarSiRol(rol, selector)` - Muestra si tiene rol

### Inicialización
- `inicializarAutenticacion()` - Inicializa página
- `inicializarAutenticacionConRol(rol)` - Inicializa con rol

---

¡Listo para integrar autenticación en tus páginas! 🚀
