"""
Blueprint de Consultas Médicas - TechnoPets 2.0
Endpoints para registrar y consultar historial médico
"""

from flask import Blueprint, request, jsonify
from functools import wraps
import sys
import os

# Importar funciones de BD
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))
from basededatospy import (
    registrar_consulta,
    obtener_historial_medico,
    obtener_diagnosticos,
    obtener_tratamientos,
    obtener_mascota_por_id,
    obtener_cita_por_id
)

# Crear blueprint
consultas_bp = Blueprint('consultas', __name__, url_prefix='/api/consultas')


def token_requerido(f):
    """Decorador para verificar que el usuario está autenticado"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'usuario'):
            return jsonify({'success': False, 'mensaje': 'No autenticado'}), 401
        return f(*args, **kwargs)
    return decorated


def es_veterinario(f):
    """Decorador para verificar que el usuario es veterinario"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.usuario.get('rol') != 'veterinario':
            return jsonify({
                'success': False,
                'mensaje': 'Acceso denegado. Solo veterinarios'
            }), 403
        return f(*args, **kwargs)
    return decorated


def verificar_mascota_acceso(id_mascota, id_dueno):
    """Verifica que el usuario tiene acceso a los datos de una mascota"""
    mascota = obtener_mascota_por_id(id_mascota)
    if not mascota or mascota.get('id_dueno') != id_dueno:
        return False
    return True


# ==================== ENDPOINTS ====================

@consultas_bp.route('/<int:id_mascota>', methods=['GET'])
@token_requerido
def obtener_historial(id_mascota):
    """
    GET /api/consultas/<id_mascota>
    Obtiene el historial médico de una mascota
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # Verificar acceso
        if not verificar_mascota_acceso(id_mascota, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para acceder al historial de esta mascota'
            }), 403
        
        # Obtener historial
        historial = obtener_historial_medico(id_mascota)
        
        return jsonify({
            'success': True,
            'id_mascota': id_mascota,
            'cantidad_consultas': len(historial),
            'historial': historial
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@consultas_bp.route('', methods=['POST'])
@token_requerido
@es_veterinario
def registrar_nueva_consulta():
    """
    POST /api/consultas
    Registra una nueva consulta médica (Solo veterinarios)
    
    Body:
    {
        "id_cita": 3001,
        "id_mascota": 101,
        "id_veterinario": 1098484890,
        "temperatura": 38.5,
        "id_diagnostico": 1,
        "id_tratamiento": 2,
        "id_observacion": 1
    }
    """
    try:
        datos = request.get_json()
        
        # Validar campos requeridos
        campos_requeridos = ['id_cita', 'id_mascota', 'id_veterinario', 'temperatura']
        errores = []
        
        for campo in campos_requeridos:
            if campo not in datos:
                errores.append(f'{campo} es requerido')
        
        if errores:
            return jsonify({
                'success': False,
                'mensaje': 'Errores de validación',
                'errores': errores
            }), 400
        
        # Validar que la cita existe
        cita = obtener_cita_por_id(datos['id_cita'])
        if not cita:
            return jsonify({
                'success': False,
                'mensaje': 'Cita no encontrada'
            }), 404
        
        # Validar que la mascota existe
        mascota = obtener_mascota_por_id(datos['id_mascota'])
        if not mascota:
            return jsonify({
                'success': False,
                'mensaje': 'Mascota no encontrada'
            }), 404
        
        # Validar temperatura
        try:
            temperatura = float(datos['temperatura'])
            if temperatura < 35 or temperatura > 42:
                return jsonify({
                    'success': False,
                    'mensaje': 'Temperatura fuera de rango (35-42°C)'
                }), 400
        except ValueError:
            return jsonify({
                'success': False,
                'mensaje': 'Temperatura debe ser un número decimal'
            }), 400
        
        # Registrar consulta
        resultado = registrar_consulta(
            datos['id_cita'],
            datos['id_mascota'],
            datos['id_veterinario'],
            temperatura,
            datos.get('id_diagnostico'),
            datos.get('id_tratamiento'),
            datos.get('id_observacion')
        )
        
        if not resultado.get('success'):
            return jsonify(resultado), 400
        
        return jsonify({
            'success': True,
            'mensaje': 'Consulta registrada exitosamente',
            'id_consulta': resultado['id_consulta']
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al registrar consulta: {str(e)}'
        }), 500


@consultas_bp.route('/diagnosticos', methods=['GET'])
@token_requerido
def listar_diagnosticos():
    """
    GET /api/consultas/diagnosticos
    Obtiene lista de diagnósticos disponibles
    """
    try:
        diagnosticos = obtener_diagnosticos()
        
        return jsonify({
            'success': True,
            'diagnosticos': diagnosticos,
            'cantidad': len(diagnosticos)
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@consultas_bp.route('/tratamientos', methods=['GET'])
@token_requerido
def listar_tratamientos():
    """
    GET /api/consultas/tratamientos
    Obtiene lista de tratamientos disponibles
    """
    try:
        tratamientos = obtener_tratamientos()
        
        return jsonify({
            'success': True,
            'tratamientos': tratamientos,
            'cantidad': len(tratamientos)
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500
