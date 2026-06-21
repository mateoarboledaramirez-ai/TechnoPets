# 🎯 PLAN DE ACCIÓN INMEDIATA - PRÓXIMOS PASOS

**Documento para iniciar desarrollo del MVP**

---

## ✅ QUE VIENE A CONTINUACIÓN

### FASE 1: Semana 1 (36 horas)

#### DÍA 1-2: Setup y Mascotas (12 hrs)

##### Backend - Crear archivo `Backend/mascotas.py`
```python
from flask import Blueprint, request, jsonify
from functools import wraps
import sys, os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))
from basededatospy import (
    registrar_mascota,
    obtener_id_especie,
    # AGREGAR: obtener_mascotas_dueno, actualizar_mascota, eliminar_mascota
)

mascotas_bp = Blueprint('mascotas', __name__, url_prefix='/api')

# ENDPOINTS:
@mascotas_bp.route('/mascotas', methods=['GET'])
@token_requerido  # Del decorador en app.py
def obtener_mascotas():
    """Obtiene mascotas del usuario autenticado"""
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # TODO: Implementar obtener_mascotas_dueno en basededatospy.py
        mascotas = obtener_mascotas_dueno(id_dueno)
        
        return jsonify({
            'success': True,
            'mascotas': mascotas
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mascotas_bp.route('/mascotas/<int:mascota_id>', methods=['GET'])
@token_requerido
def obtener_mascota(mascota_id):
    """Obtiene detalles de una mascota"""
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # TODO: Implementar validar_pertenencia en basededatospy.py
        mascota = obtener_mascota_por_id(mascota_id)
        
        if mascota['id_dueno'] != id_dueno:
            return jsonify({'success': False, 'error': 'No autorizado'}), 403
        
        return jsonify({'success': True, 'mascota': mascota}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@mascotas_bp.route('/mascotas', methods=['POST'])
@token_requerido
def crear_mascota():
    """Crea una nueva mascota"""
    try:
        datos = request.get_json()
        id_dueno = request.usuario.get('id_dueno')
        
        # Validaciones
        if not datos.get('nombre') or len(datos['nombre']) < 2:
            return jsonify({'success': False, 'error': 'Nombre inválido'}), 400
        
        if datos.get('especie') not in ['perro', 'gato', 'conejo']:
            return jsonify({'success': False, 'error': 'Especie no válida'}), 400
        
        # Registrar
        id_especie = obtener_id_especie(datos['especie'])
        
        # TODO: Agregar id_mascota al retorno
        registrar_mascota(
            datos['nombre'],
            datos['especie'],
            datos.get('raza', 'Sin raza'),
            datos.get('edad', 0),
            datos.get('sexo', 'No especificado'),
            datos.get('peso', '0kg'),
            id_dueno
        )
        
        return jsonify({
            'success': True,
            'message': 'Mascota creada',
            'mascota': datos
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# En app.py, agregar al final:
# app.register_blueprint(mascotas_bp)
```

##### Control - Agregar funciones a `basededatospy.py`
```python
def obtener_mascotas_dueno(id_dueno):
    """Obtiene todas las mascotas de un dueño"""
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        cursor.execute('''
            SELECT * FROM mascota WHERE id_dueno = ?
        ''', (id_dueno,))
        mascotas = cursor.fetchall()
        return [dict(m) for m in mascotas]

def obtener_mascota_por_id(id_mascota):
    """Obtiene una mascota por ID"""
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        cursor.execute('SELECT * FROM mascota WHERE id_mascota = ?', (id_mascota,))
        return cursor.fetchone()

def actualizar_mascota(id_mascota, datos):
    """Actualiza datos de mascota"""
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        # Solo actualizar campos válidos
        actualizables = ['nombre_mascota', 'raza', 'edad', 'sexo', 'peso']
        campos = [f"{k}=?" for k in datos.keys() if k in actualizables]
        valores = [v for k,v in datos.items() if k in actualizables]
        
        if not campos:
            return False
        
        sql = f"UPDATE mascota SET {','.join(campos)} WHERE id_mascota = ?"
        valores.append(id_mascota)
        cursor.execute(sql, valores)
        conexion.commit()
        return cursor.rowcount > 0

def eliminar_mascota(id_mascota):
    """Elimina una mascota (soft delete)"""
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        # TODO: Agregar columna 'activo' a tabla mascota
        cursor.execute('DELETE FROM mascota WHERE id_mascota = ?', (id_mascota,))
        conexion.commit()
        return cursor.rowcount > 0
```

#### DÍA 3: Integración Frontend (6 hrs)

##### Actualizar `Vista/js/api-client.js` (Crear si no existe)
```javascript
/**
 * Cliente API centralizado para todas las solicitudes
 */
class APIClient {
    constructor(baseURL = 'http://127.0.0.1:5000') {
        this.baseURL = baseURL;
    }

    async request(method, endpoint, data = null) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.mensaje || json.error || 'Error desconocido');
            }

            return json;
        } catch (error) {
            console.error(`Error en ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    get(endpoint) { return this.request('GET', endpoint); }
    post(endpoint, data) { return this.request('POST', endpoint, data); }
    put(endpoint, data) { return this.request('PUT', endpoint, data); }
    delete(endpoint) { return this.request('DELETE', endpoint); }
    patch(endpoint, data) { return this.request('PATCH', endpoint, data); }
}

// Crear instancia global
const apiClient = new APIClient();
```

##### Actualizar `Vista/Pagina_Principal.html`
```html
<!-- Agregar sección de mascotas -->
<section class="mascotas-section">
    <h2>Mis Mascotas</h2>
    <div id="mascotas-list"></div>
    <button onclick="abrirAgregarMascota()">+ Agregar Mascota</button>
</section>

<!-- Modal para agregar mascota -->
<div id="modal-mascota" style="display:none;">
    <form id="form-mascota" onsubmit="crearMascota(event)">
        <input type="text" id="mascota-nombre" placeholder="Nombre" required>
        <select id="mascota-especie">
            <option>perro</option>
            <option>gato</option>
            <option>conejo</option>
        </select>
        <input type="number" id="mascota-edad" placeholder="Edad">
        <button type="submit">Crear</button>
    </form>
</div>

<script src="js/api-client.js"></script>
<script src="js/auth.js"></script>
<script>
    async function cargarMascotas() {
        try {
            const datos = await apiClient.get('/api/mascotas');
            const lista = document.getElementById('mascotas-list');
            
            if (datos.mascotas && datos.mascotas.length > 0) {
                lista.innerHTML = datos.mascotas.map(m => `
                    <div class="mascota-card">
                        <h3>${m.nombre_mascota}</h3>
                        <p>${m.especie} - ${m.edad} años</p>
                        <button onclick="editarMascota(${m.id_mascota})">Editar</button>
                    </div>
                `).join('');
            } else {
                lista.innerHTML = '<p>No tienes mascotas registradas</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            lista.innerHTML = '<p>Error al cargar mascotas</p>';
        }
    }

    async function crearMascota(event) {
        event.preventDefault();
        
        const datos = {
            nombre: document.getElementById('mascota-nombre').value,
            especie: document.getElementById('mascota-especie').value,
            edad: parseInt(document.getElementById('mascota-edad').value) || 0,
            raza: 'No especificada',
            sexo: 'M',
            peso: '0kg'
        };

        try {
            const resultado = await apiClient.post('/api/mascotas', datos);
            if (resultado.success) {
                alert('✅ Mascota creada');
                document.getElementById('form-mascota').reset();
                document.getElementById('modal-mascota').style.display = 'none';
                cargarMascotas();
            }
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    function abrirAgregarMascota() {
        document.getElementById('modal-mascota').style.display = 'block';
    }

    // Cargar al iniciar
    document.addEventListener('DOMContentLoaded', () => {
        inicializarAutenticacion();
        cargarMascotas();
    });
</script>
```

#### DÍA 4-5: Citas Básicas (12 hrs)

##### Backend - Crear `Backend/citas.py`
```python
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import sys, os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))
from basededatospy import (
    # TODO: Agregar funciones de cita
    registrar_cita,
    obtener_citas_usuario,
    obtener_disponibilidad,
)

citas_bp = Blueprint('citas', __name__, url_prefix='/api')

@citas_bp.route('/citas', methods=['GET'])
@token_requerido
def obtener_citas():
    """Obtiene citas del usuario"""
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # TODO: Filtrar por estado, fecha, etc
        citas = obtener_citas_usuario(id_dueno)
        
        return jsonify({'success': True, 'citas': citas}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@citas_bp.route('/citas/disponibilidad', methods=['GET'])
def obtener_disponibilidad():
    """Retorna slots disponibles para una fecha"""
    try:
        fecha = request.args.get('fecha')  # YYYY-MM-DD
        duracion = int(request.args.get('duracion', 30))
        
        if not fecha:
            return jsonify({'success': False, 'error': 'Fecha requerida'}), 400
        
        # Horario clínica: 8am - 6pm, slots de 30 min
        slots = []
        inicio = datetime.strptime(f"{fecha} 08:00", "%Y-%m-%d %H:%M")
        fin = datetime.strptime(f"{fecha} 18:00", "%Y-%m-%d %H:%M")
        
        # TODO: Restar citas existentes
        # TODO: Restar horarios bloqueados (almuerzo, etc)
        
        while inicio < fin:
            slots.append(inicio.strftime("%H:%M"))
            inicio += timedelta(minutes=duracion)
        
        return jsonify({'success': True, 'slots': slots}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@citas_bp.route('/citas', methods=['POST'])
@token_requerido
def crear_cita():
    """Crea una nueva cita"""
    try:
        datos = request.get_json()
        id_dueno = request.usuario.get('id_dueno')
        
        # Validaciones
        if not datos.get('id_mascota'):
            return jsonify({'success': False, 'error': 'Mascota requerida'}), 400
        
        if not datos.get('fecha'):
            return jsonify({'success': False, 'error': 'Fecha requerida'}), 400
        
        if not datos.get('hora'):
            return jsonify({'success': False, 'error': 'Hora requerida'}), 400
        
        # TODO: Validar que mascota pertenece a usuario
        # TODO: Validar fecha no pasada
        # TODO: Validar slot disponible
        
        # Crear cita
        id_cita = registrar_cita(
            datos['fecha'],
            datos['hora'],
            datos['id_mascota'],
            datos.get('id_veterinario', 1),  # TODO: Asignación inteligente
            datos.get('motivo', 'Consulta general')
        )
        
        return jsonify({
            'success': True,
            'message': 'Cita creada',
            'id_cita': id_cita
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# En app.py: app.register_blueprint(citas_bp)
```

---

### DÍA 6: Testing y Validación (6 hrs)

#### Crear `Backend/test_endpoints.py`
```python
import unittest
import json
from app import app

class TestEndpoints(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.token = None
        # TODO: Login de prueba para obtener token
    
    def test_obtener_mascotas(self):
        """Prueba GET /api/mascotas"""
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.app.get('/api/mascotas', headers=headers)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('mascotas', data)
    
    def test_crear_mascota(self):
        """Prueba POST /api/mascotas"""
        headers = {'Authorization': f'Bearer {self.token}'}
        mascota = {
            'nombre': 'Test',
            'especie': 'perro',
            'edad': 3
        }
        response = self.app.post(
            '/api/mascotas',
            data=json.dumps(mascota),
            headers=headers,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
    
    def test_obtener_disponibilidad(self):
        """Prueba GET /api/citas/disponibilidad"""
        response = self.app.get('/api/citas/disponibilidad?fecha=2026-06-20')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('slots', data)

if __name__ == '__main__':
    unittest.main()
```

**Ejecutar con:**
```bash
python -m pytest Backend/test_endpoints.py -v
```

---

## 📋 CHECKLIST PARA COMPLETAR SEMANA 1

- [ ] Crear `Backend/mascotas.py` con 3 endpoints
- [ ] Agregar 4 funciones a `basededatospy.py`
- [ ] Crear `Vista/js/api-client.js`
- [ ] Actualizar `Vista/Pagina_Principal.html`
- [ ] Crear `Backend/citas.py` con 3 endpoints
- [ ] Agregar funciones de cita a BD
- [ ] Crear tests básicos
- [ ] Verificar que endpoints responden (Postman o curl)
- [ ] Verificar que frontend carga datos
- [ ] Documentar cambios en CAMBIOS.md

---

## 🔧 HERRAMIENTAS NECESARIAS

### Para probar endpoints:
```bash
# Instalar curl (Windows)
winget install curl

# O usar Postman
https://www.postman.com/downloads/

# Ejemplo con curl:
curl -X GET http://127.0.0.1:5000/api/mascotas \
  -H "Authorization: Bearer TOKEN_AQUI"
```

### Para debugging:
```bash
# Agregar logs en app.py
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.debug(f"Usuario ID: {request.usuario}")
logger.info("Mascota creada exitosamente")
logger.error(f"Error: {str(e)}")
```

---

## 🚨 DECISIONES PENDIENTES ANTES DE EMPEZAR

1. **¿Usar blueprints o mantener app.py único?**
   - Recomendación: **Blueprints** (código más limpio)

2. **¿Dónde validar permisos (en endpoint o en funciones)?**
   - Recomendación: **Decorador en endpoint** (más fácil de auditar)

3. **¿SQLite o migrar a PostgreSQL?**
   - Para MVP: **SQLite OK**
   - Para producción: **PostgreSQL recomendado**

4. **¿Agregar logging ahora o después?**
   - Recomendación: **Desde ahora** (útil para debugging)

---

## 📚 REFERENCIAS

| Recurso | URL |
|---------|-----|
| Flask Blueprints | https://flask.palletsprojects.com/blueprints |
| SQLite Docs | https://www.sqlite.org/docs.html |
| JWT Tests | https://jwt.io |
| Postman | https://www.postman.com |

---

## ✉️ PRÓXIMOS DOCUMENTOS

1. **ARQUITECTURA.md** - Cómo está organizado el código
2. **SCHEMA_BD.md** - Documentación detallada de tablas
3. **DEPLOYMENT.md** - Cómo subir a producción
4. **TESTING.md** - Estrategia completa de testing

