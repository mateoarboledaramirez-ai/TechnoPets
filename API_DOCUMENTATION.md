# API TechnoPets 2.0 - Documentación de Endpoints

## Base URL
```
http://127.0.0.1:5000
```

---

## 🔓 ENDPOINTS PÚBLICOS (Sin autenticación)

### 1. Health Check
**GET** `/`
- Verifica que el servidor está funcionando
- **Response:** 
```json
{
  "mensaje": "Servidor TechnoPets funcionando correctamente",
  "version": "2.0",
  "estado": "activo"
}
```

---

### 2. Login
**POST** `/api/login`
- Autentica un usuario y retorna un token JWT
- **Body:**
```json
{
  "correo": "usuario@example.com",
  "contrasena": "contraseña123"
}
```
- **Response (Exitoso - 200):**
```json
{
  "success": true,
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "correo": "usuario@example.com",
    "rol": "cliente",
    "id_dueno": 123
  }
}
```
- **Response (Error - 401):**
```json
{
  "success": false,
  "mensaje": "Correo o contraseña incorrectos"
}
```

---

### 3. Registro
**POST** `/api/registro`
- Crea una nueva cuenta de usuario, dueño y mascotas
- **Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "3215551234",
  "contrasena": "miContraseña123",
  "direccion": "Calle 45 No. 23-15",
  "mascotas": [
    {
      "nombre": "Max",
      "especie": "perro",
      "raza": "Labrador",
      "edad": 3,
      "sexo": "macho",
      "peso": "25kg"
    },
    {
      "nombre": "Luna",
      "especie": "gato",
      "raza": "Siamés",
      "edad": 2,
      "sexo": "hembra",
      "peso": "4kg"
    }
  ]
}
```
- **Response (Exitoso - 201):**
```json
{
  "success": true,
  "mensaje": "Registro realizado correctamente",
  "datos": {
    "id_dueno": 10,
    "id_usuario": 5,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "mascotas_registradas": ["Max", "Luna"]
  }
}
```
- **Validaciones:**
  - Nombre: mínimo 2 caracteres
  - Correo: formato válido y no duplicado
  - Teléfono: formato válido (7-15 dígitos)
  - Contraseña: mínimo 6 caracteres
  - Especies válidas: "perro", "gato"

---

## 🔐 ENDPOINTS PROTEGIDOS (Requieren token JWT)

### Headers requeridos:
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

---

### 4. Obtener Perfil del Usuario
**GET** `/api/usuario/perfil`
- Retorna los datos del usuario autenticado
- **Response:**
```json
{
  "success": true,
  "usuario": {
    "id_usuario": 1,
    "correo": "usuario@example.com",
    "rol": "cliente",
    "id_dueno": 123,
    "activo": 1
  }
}
```

---

### 5. Validar Token
**POST** `/api/validar-token`
- Valida que el token JWT es válido
- **Response:**
```json
{
  "success": true,
  "mensaje": "Token válido",
  "usuario": {
    "id_usuario": 1,
    "correo": "usuario@example.com",
    "rol": "cliente",
    "exp": 1234567890
  }
}
```

---

## 📋 CÓDIGOS DE RESPUESTA HTTP

| Código | Significado |
|--------|------------|
| 200 | Solicitud exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos o incompletos |
| 401 | No autenticado o token inválido |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## 🔑 Cómo usar tokens JWT

1. **Hacer login:**
```javascript
const response = await fetch('http://127.0.0.1:5000/api/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    correo: 'usuario@example.com',
    contrasena: 'contraseña123'
  })
});

const datos = await response.json();
const token = datos.token; // Guardar este token
localStorage.setItem('token', token); // Guardar en localStorage
```

2. **Usar token en solicitudes protegidas:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://127.0.0.1:5000/api/usuario/perfil', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const datos = await response.json();
console.log(datos.usuario);
```

3. **Manejar token expirado:**
```javascript
if (response.status === 401) {
  console.log('Token expirado, hace login nuevamente');
  localStorage.removeItem('token');
  // Redirigir a página de login
  window.location.href = '/Vista/Inicio_de_sesion.html';
}
```

---

## ⚠️ Notas de Seguridad

1. **Nunca** guardes contraseñas en texto plano
2. **Siempre** usa HTTPS en producción
3. El token expira en **24 horas**
4. Los tokens se guardan seguros con hash SHA-256
5. Las contraseñas se hashean con bcrypt
6. CORS está habilitado para desarrollo

---

## 🧪 Pruebas con cURL

```bash
# Login
curl -X POST http://127.0.0.1:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario@example.com","contrasena":"contraseña123"}'

# Obtener perfil (reemplazar TOKEN)
curl -X GET http://127.0.0.1:5000/api/usuario/perfil \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📝 Próximas características a implementar

- [ ] Endpoints para gestionar citas
- [ ] Endpoints para ver historial médico
- [ ] Endpoints para gestionar mascotas
- [ ] Endpoints para rol de veterinario
- [ ] Endpoints para rol de recepcionista
- [ ] Endpoints para sistema de pagos
