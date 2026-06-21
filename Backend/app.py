from flask import Flask, request, jsonify, session
from flask_cors import CORS
from functools import wraps
import jwt
import sys
import os
import re
from datetime import datetime, timedelta

# Agregar la carpeta Control al path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))

from basededatospy import (
    registrar_dueno, 
    registrar_mascota,
    registrar_usuario,
    validar_usuario,
    obtener_usuario_por_id,
    verificar_correo_existe,
    obtener_id_especie
)

app = Flask(__name__)
CORS(app)

# Configuración secreta para JWT
app.config['SECRET_KEY'] = 'technopets_secret_key_2024'
app.config['JWT_EXPIRATION_HOURS'] = 24

# Decorador para validar token JWT
def token_requerido(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Obtener token del header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'success': False, 'mensaje': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'success': False, 'mensaje': 'Token requerido'}), 401
        
        try:
            # Decodificar token
            datos = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.usuario = datos
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'mensaje': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'mensaje': 'Token inválido'}), 401
        
        return f(*args, **kwargs)
    
    return decorated


def validar_email(correo):
    """Valida formato de email"""
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, correo) is not None


def validar_telefono(telefono):
    """Valida formato de teléfono"""
    # Acepta formatos: +573xx, 3xx, (3xx)
    patron = r'^[\+]?[\d\s\-\(\)]{7,15}$'
    return re.match(patron, telefono) is not None


def crear_token(id_usuario, correo, rol):
    """Crea un token JWT"""
    payload = {
        'id_usuario': id_usuario,
        'correo': correo,
        'rol': rol,
        'exp': datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRATION_HOURS'])
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


# ==================== RUTAS PÚBLICAS ====================

@app.route("/", methods=["GET"])
def inicio():
    return jsonify({
        "mensaje": "Servidor TechnoPets funcionando correctamente",
        "version": "2.0",
        "estado": "activo"
    })


@app.route("/api/login", methods=["POST"])
def login():
    """Endpoint de login - Autentica usuario y retorna token JWT"""
    try:
        datos = request.get_json()
        
        if not datos:
            return jsonify({
                'success': False,
                'mensaje': 'Datos incompletos'
            }), 400
        
        correo = datos.get('correo', '').strip()
        contrasena = datos.get('contrasena', '')
        
        # Validaciones
        if not correo or not contrasena:
            return jsonify({
                'success': False,
                'mensaje': 'Correo y contraseña son requeridos'
            }), 400
        
        if not validar_email(correo):
            return jsonify({
                'success': False,
                'mensaje': 'Formato de correo inválido'
            }), 400
        
        # Validar credenciales
        usuario = validar_usuario(correo, contrasena)
        
        if not usuario:
            return jsonify({
                'success': False,
                'mensaje': 'Correo o contraseña incorrectos'
            }), 401
        
        # Crear token
        token = crear_token(usuario['id_usuario'], usuario['correo'], usuario['rol'])
        
        return jsonify({
            'success': True,
            'mensaje': 'Login exitoso',
            'token': token,
            'usuario': {
                'id_usuario': usuario['id_usuario'],
                'correo': usuario['correo'],
                'rol': usuario['rol'],
                'id_dueno': usuario['id_dueno']
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error en login: {str(e)}'
        }), 500


@app.route("/api/registro", methods=["POST"])
def registro():
    """Endpoint de registro - Crea nuevo usuario y dueño con mascotas"""
    try:
        datos = request.get_json()
        
        if not datos:
            return jsonify({
                'success': False,
                'mensaje': 'Datos incompletos'
            }), 400
        
        # Validar campos requeridos
        nombre = datos.get('nombre', '').strip()
        correo = datos.get('correo', '').strip()
        telefono = datos.get('telefono', '').strip()
        contrasena = datos.get('contrasena', '')
        direccion = datos.get('direccion', 'Sin dirección').strip()
        mascotas = datos.get('mascotas', [])
        
        # Validaciones
        errores = []
        
        if not nombre or len(nombre) < 2:
            errores.append('Nombre inválido (mínimo 2 caracteres)')
        
        if not correo or not validar_email(correo):
            errores.append('Correo inválido')
        
        if not telefono or not validar_telefono(telefono):
            errores.append('Teléfono inválido')
        
        if not contrasena or len(contrasena) < 6:
            errores.append('Contraseña debe tener mínimo 6 caracteres')
        
        if errores:
            return jsonify({
                'success': False,
                'mensaje': 'Errores de validación',
                'errores': errores
            }), 400
        
        # Verificar si correo ya existe
        if verificar_correo_existe(correo):
            return jsonify({
                'success': False,
                'mensaje': 'El correo ya está registrado'
            }), 400
        
        # Registrar dueño
        id_dueno = registrar_dueno(
            nombre,
            telefono,
            direccion,
            correo
        )
        
        if not id_dueno:
            return jsonify({
                'success': False,
                'mensaje': 'Error al registrar dueño'
            }), 500
        
        # Registrar usuario
        resultado_usuario = registrar_usuario(correo, contrasena, 'cliente', id_dueno)
        
        if not resultado_usuario.get('success'):
            return jsonify({
                'success': False,
                'mensaje': f"Error al registrar usuario: {resultado_usuario.get('error')}"
            }), 500
        
        # Registrar mascotas
        mascotas_registradas = []
        for mascota in mascotas:
            try:
                registrar_mascota(
                    mascota.get('nombre', '').strip(),
                    mascota.get('especie', '').strip(),
                    mascota.get('raza', '').strip(),
                    mascota.get('edad', 0),
                    mascota.get('sexo', '').strip(),
                    mascota.get('peso', '').strip(),
                    id_dueno
                )
                mascotas_registradas.append(mascota.get('nombre', 'Sin nombre'))
            except Exception as e:
                # Continuar con otras mascotas si una falla
                print(f"Error registrando mascota: {str(e)}")
        
        return jsonify({
            'success': True,
            'mensaje': 'Registro realizado correctamente',
            'datos': {
                'id_dueno': id_dueno,
                'id_usuario': resultado_usuario.get('id_usuario'),
                'nombre': nombre,
                'correo': correo,
                'mascotas_registradas': mascotas_registradas
            }
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error en registro: {str(e)}'
        }), 500


# ==================== RUTAS PROTEGIDAS ====================

@app.route("/api/usuario/perfil", methods=["GET"])
@token_requerido
def obtener_perfil():
    """Obtiene el perfil del usuario autenticado"""
    try:
        id_usuario = request.usuario.get('id_usuario')
        usuario = obtener_usuario_por_id(id_usuario)
        
        if not usuario:
            return jsonify({
                'success': False,
                'mensaje': 'Usuario no encontrado'
            }), 404
        
        return jsonify({
            'success': True,
            'usuario': usuario
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@app.route("/api/validar-token", methods=["POST"])
@token_requerido
def validar_token():
    """Valida que el token es válido"""
    return jsonify({
        'success': True,
        'mensaje': 'Token válido',
        'usuario': request.usuario
    }), 200


# ==================== IMPORTAR Y REGISTRAR BLUEPRINTS ====================

# Importar blueprints de otros módulos
from mascotas import mascotas_bp
from citas import citas_bp
from consultas import consultas_bp

# Registrar blueprints
app.register_blueprint(mascotas_bp)
app.register_blueprint(citas_bp)
app.register_blueprint(consultas_bp)


# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def no_encontrado(error):
    return jsonify({
        'success': False,
        'mensaje': 'Ruta no encontrada'
    }), 404


@app.errorhandler(500)
def error_interno(error):
    return jsonify({
        'success': False,
        'mensaje': 'Error interno del servidor'
    }), 500


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)