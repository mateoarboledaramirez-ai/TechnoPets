"""
Blueprint de Mascotas - TechnoPets 2.0
Endpoints para gestionar mascotas de los usuarios
"""

from flask import Blueprint, request, jsonify
from functools import wraps
import sys
import os

# Importar funciones de BD
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))
from basededatospy import (
    obtener_mascotas_por_dueno,
    obtener_mascota_por_id,
    registrar_mascota,
    actualizar_mascota,
    eliminar_mascota,
    obtener_id_especie
)

# Crear blueprint
mascotas_bp = Blueprint('mascotas', __name__, url_prefix='/api/mascotas')


def token_requerido(f):
    """Decorador para verificar que el usuario está autenticado"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'usuario'):
            return jsonify({'success': False, 'mensaje': 'No autenticado'}), 401
        return f(*args, **kwargs)
    return decorated


def verificar_mascota_pertenece_dueno(id_mascota, id_dueno):
    """Verifica que una mascota pertenece a un dueño específico"""
    mascota = obtener_mascota_por_id(id_mascota)
    if not mascota or mascota.get('id_dueno') != id_dueno:
        return False
    return True


# ==================== ENDPOINTS ====================

@mascotas_bp.route('', methods=['GET'])
@token_requerido
def listar_mascotas():
    """
    GET /api/mascotas
    Obtiene todas las mascotas del usuario autenticado
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        if not id_dueno:
            return jsonify({
                'success': False,
                'mensaje': 'Usuario no tiene mascotas registradas'
            }), 400
        
        mascotas = obtener_mascotas_por_dueno(id_dueno)
        
        return jsonify({
            'success': True,
            'mensaje': f'Se encontraron {len(mascotas)} mascotas',
            'mascotas': mascotas,
            'cantidad': len(mascotas)
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al obtener mascotas: {str(e)}'
        }), 500


@mascotas_bp.route('/<int:id_mascota>', methods=['GET'])
@token_requerido
def obtener_mascota(id_mascota):
    """
    GET /api/mascotas/<id>
    Obtiene los detalles de una mascota específica
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # Verificar que la mascota pertenece al usuario
        if not verificar_mascota_pertenece_dueno(id_mascota, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para acceder a esta mascota'
            }), 403
        
        mascota = obtener_mascota_por_id(id_mascota)
        
        if not mascota:
            return jsonify({
                'success': False,
                'mensaje': 'Mascota no encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'mascota': mascota
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@mascotas_bp.route('', methods=['POST'])
@token_requerido
def crear_mascota():
    """
    POST /api/mascotas
    Crea una nueva mascota para el usuario autenticado
    
    Body:
    {
        "nombre": "Max",
        "especie": "perro",
        "raza": "Labrador",
        "edad": 3,
        "sexo": "macho",
        "peso": "25kg"
    }
    """
    try:
        datos = request.get_json()
        id_dueno = request.usuario.get('id_dueno')
        
        if not id_dueno:
            return jsonify({
                'success': False,
                'mensaje': 'Usuario sin perfil de dueño'
            }), 400
        
        # Validar campos requeridos
        campos_requeridos = ['nombre', 'especie', 'raza', 'edad', 'sexo', 'peso']
        errores = []
        
        for campo in campos_requeridos:
            if campo not in datos or not str(datos[campo]).strip():
                errores.append(f'{campo} es requerido')
        
        if errores:
            return jsonify({
                'success': False,
                'mensaje': 'Errores de validación',
                'errores': errores
            }), 400
        
        # Validar edad (debe ser número)
        try:
            edad = int(datos['edad'])
            if edad < 0 or edad > 50:
                return jsonify({
                    'success': False,
                    'mensaje': 'La edad debe estar entre 0 y 50 años'
                }), 400
        except ValueError:
            return jsonify({
                'success': False,
                'mensaje': 'La edad debe ser un número'
            }), 400
        
        # Registrar mascota
        id_mascota = registrar_mascota(
            datos['nombre'].strip(),
            datos['especie'].strip(),
            datos['raza'].strip(),
            edad,
            datos['sexo'].strip(),
            datos['peso'].strip(),
            id_dueno
        )
        
        if not id_mascota:
            return jsonify({
                'success': False,
                'mensaje': 'Error al registrar mascota'
            }), 500
        
        return jsonify({
            'success': True,
            'mensaje': 'Mascota creada exitosamente',
            'id_mascota': id_mascota,
            'mascota': {
                'id_mascota': id_mascota,
                'nombre_mascota': datos['nombre'],
                'especie': datos['especie'],
                'raza': datos['raza'],
                'edad': edad,
                'sexo': datos['sexo'],
                'peso': datos['peso']
            }
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al crear mascota: {str(e)}'
        }), 500


@mascotas_bp.route('/<int:id_mascota>', methods=['PUT'])
@token_requerido
def editar_mascota(id_mascota):
    """
    PUT /api/mascotas/<id>
    Actualiza los datos de una mascota
    
    Body (todos los campos opcionales):
    {
        "nombre": "Maxwell",
        "raza": "Labrador Retriever",
        "edad": 4,
        "sexo": "macho",
        "peso": "26kg"
    }
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        datos = request.get_json() or {}
        
        # Verificar que la mascota pertenece al usuario
        if not verificar_mascota_pertenece_dueno(id_mascota, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para editar esta mascota'
            }), 403
        
        # Validar edad si se proporciona
        if 'edad' in datos and datos['edad'] is not None:
            try:
                edad = int(datos['edad'])
                if edad < 0 or edad > 50:
                    return jsonify({
                        'success': False,
                        'mensaje': 'La edad debe estar entre 0 y 50 años'
                    }), 400
            except ValueError:
                return jsonify({
                    'success': False,
                    'mensaje': 'La edad debe ser un número'
                }), 400
        
        # Actualizar mascota
        resultado = actualizar_mascota(
            id_mascota,
            nombre=datos.get('nombre'),
            raza=datos.get('raza'),
            edad=datos.get('edad'),
            sexo=datos.get('sexo'),
            peso=datos.get('peso')
        )
        
        if not resultado.get('success'):
            return jsonify(resultado), 400
        
        mascota_actualizada = obtener_mascota_por_id(id_mascota)
        
        return jsonify({
            'success': True,
            'mensaje': 'Mascota actualizada exitosamente',
            'mascota': mascota_actualizada
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al actualizar mascota: {str(e)}'
        }), 500


@mascotas_bp.route('/<int:id_mascota>', methods=['DELETE'])
@token_requerido
def eliminar_mascota_endpoint(id_mascota):
    """
    DELETE /api/mascotas/<id>
    Elimina una mascota
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # Verificar que la mascota pertenece al usuario
        if not verificar_mascota_pertenece_dueno(id_mascota, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para eliminar esta mascota'
            }), 403
        
        # Eliminar mascota
        resultado = eliminar_mascota(id_mascota)
        
        if not resultado.get('success'):
            return jsonify(resultado), 400
        
        return jsonify({
            'success': True,
            'mensaje': 'Mascota eliminada exitosamente'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al eliminar mascota: {str(e)}'
        }), 500
