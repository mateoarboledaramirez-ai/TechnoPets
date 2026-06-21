# 🐾 TechnoPets 2.0 - Veterinary Clinic Management System

![Version](https://img.shields.io/badge/version-2.0-blue)
![Status](https://img.shields.io/badge/status-Active%20Development-green)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3+-green)

---

## 📋 Descripción

TechnoPets es un sistema completo de gestión para clínicas veterinarias que permite:
- 👤 Registro y autenticación de usuarios
- 🐕 Gestión de mascotas
- 📅 Agendamiento de citas
- 💊 Historial médico
- 💰 Sistema de pagos
- 👨‍⚕️ Gestión de roles (Cliente, Veterinario, Recepcionista, Admin)

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Instalación

1. **Clonar o descargar el proyecto:**
```bash
cd TechnoPets2.0
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Ejecutar el servidor Flask:**
```bash
cd Backend
python app.py
```

El servidor estará disponible en `http://127.0.0.1:5000`

---

## 📁 Estructura del Proyecto

```
TechnoPets2.0/
├── Backend/
│   ├── app.py              # Servidor Flask principal
│   ├── login.py            # Funciones de login (vacío)
│   ├── registro.py         # Funciones de registro (vacío)
│   └── conexion.py         # Conexión a base de datos
├── Control/
│   ├── basededatospy.py    # Funciones de BD
│   └── database.db         # Base de datos SQLite
├── Modelo/
│   └── SQL/
│       └── veterinaria_technopets.sql
├── Vista/
│   ├── html/               # Páginas HTML
│   ├── css/                # Estilos CSS
│   └── js/
│       ├── auth.js         # Sistema de autenticación
│       └── *.js            # Scripts de páginas
├── requirements.txt        # Dependencias Python
├── API_DOCUMENTATION.md    # Documentación de API
└── CAMBIOS.md              # Resumen de cambios
```

---

## 🔑 Autenticación

### Flujo de Login

1. Usuario ingresa correo y contraseña
2. El servidor valida las credenciales
3. Se retorna un token JWT
4. El token se guarda en `localStorage`
5. Todas las solicitudes posteriores incluyen el token

### Ejemplo de Login (JavaScript)

```javascript
// Hacer login
const respuesta = await fetch('http://127.0.0.1:5000/api/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    correo: 'usuario@example.com',
    contrasena: 'password123'
  })
});

const datos = await respuesta.json();
if (datos.success) {
  // Guardar token
  localStorage.setItem('token', datos.token);
  // Guardar datos de usuario
  localStorage.setItem('usuario', JSON.stringify(datos.usuario));
}
```

### Usar Utilidades de Autenticación

Incluye `auth.js` en tus páginas:

```html
<script src="/Vista/js/auth.js"></script>
<script>
  // Verificar que usuario está autenticado
  inicializarAutenticacion();
  
  // Obtener datos del usuario
  const usuario = obtenerUsuario();
  console.log('Bienvenido:', usuario.correo);
  
  // Hacer solicitud protegida
  const perfil = await llamarAPI('/usuario/perfil');
  
  // Hacer logout
  function logout() {
    eliminarToken();
    window.location.href = '/Vista/Inicio_de_sesion.html';
  }
</script>
```

---

## 🔗 API Endpoints

### Públicos (sin autenticación)

#### GET `/`
Verifica que el servidor está funcionando

#### POST `/api/login`
Autentica un usuario y retorna token JWT

**Body:**
```json
{
  "correo": "usuario@example.com",
  "contrasena": "password123"
}
```

#### POST `/api/registro`
Registra nuevo usuario, dueño y mascotas

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "3215551234",
  "contrasena": "password123",
  "direccion": "Calle 45",
  "mascotas": [
    {
      "nombre": "Max",
      "especie": "perro",
      "raza": "Labrador",
      "edad": 3,
      "sexo": "macho",
      "peso": "25kg"
    }
  ]
}
```

### Protegidos (requieren token)

#### GET `/api/usuario/perfil`
Obtiene datos del usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

#### POST `/api/validar-token`
Valida que el token es válido

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración de 24 horas
- ✅ Validaciones en frontend y backend
- ✅ CORS habilitado
- ✅ Protección contra SQL injection
- ✅ Headers de seguridad

---

## 🗄️ Base de Datos

### Tabla de Usuarios
```sql
CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY,
  correo TEXT UNIQUE,
  contrasena TEXT,
  rol TEXT,
  id_dueno INTEGER,
  activo INTEGER,
  fecha_creacion DATETIME
);
```

### Roles Disponibles
- `cliente` - Dueños de mascotas
- `veterinario` - Personal veterinario
- `recepcionista` - Personal de recepción
- `admin` - Administrador del sistema

---

## 🧪 Pruebas

### Probar con cURL

```bash
# Registrar usuario
curl -X POST http://127.0.0.1:5000/api/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","correo":"test@example.com",...}'

# Login
curl -X POST http://127.0.0.1:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@example.com","contrasena":"password"}'

# Usar token
curl -X GET http://127.0.0.1:5000/api/usuario/perfil \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Documentación Completa

Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para:
- Ejemplos detallados de solicitudes
- Códigos de respuesta HTTP
- Guía de uso de tokens JWT
- Notas de seguridad

Ver [CAMBIOS.md](CAMBIOS.md) para:
- Resumen de cambios realizados
- Mejoras de seguridad
- Próximos pasos recomendados

---

## 🐛 Solución de Problemas

### Error: "Module not found: flask_cors"
**Solución:** Instalar dependencias
```bash
pip install -r requirements.txt
```

### Error: "Token inválido" en solicitudes protegidas
**Solución:** Asegúrate de incluir el header `Authorization` con el token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Error: "CORS policy blocked"
**Solución:** CORS ya está configurado en `app.py`. Si persiste, verifica que el servidor está corriendo en `http://127.0.0.1:5000`

---

## 📝 Próximas Características

- [ ] Endpoints para gestionar mascotas
- [ ] Endpoints para citas y agenda
- [ ] Historial médico completo
- [ ] Sistema de pagos
- [ ] Notificaciones y recordatorios
- [ ] Dashboard por rol
- [ ] Reportes y estadísticas

---

## 👥 Roles y Permisos

### Cliente
- Ver perfil
- Gestionar mascotas
- Agendar citas
- Ver historial médico

### Veterinario
- Ver citas asignadas
- Registrar consultas
- Acceder a historial médico
- Prescribir tratamientos

### Recepcionista
- Gestionar agenda
- Confirmar citas
- Procesar pagos
- Gestionar clientes

### Admin
- Acceso total al sistema
- Gestionar usuarios
- Reportes
- Configuración

---

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

## 📄 Licencia

TechnoPets 2.0 - 2024

---

**¡Gracias por usar TechnoPets! 🐾**
