"""
Blueprint de Citas - TechnoPets 2.0
Endpoints para agendar, modificar y cancelar citas veterinarias
"""

from flask import Blueprint, request, jsonify
from functools import wraps
from datetime import datetime, timedelta
import sys
import os

# Importar funciones de BD
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))
from basededatospy import (
    obtener_citas_por_dueno,
    obtener_cita_por_id,
    agendar_cita,
    actualizar_cita,
    cancelar_cita,
    obtener_motivos_consulta,
    obtener_veterinarios,
    obtener_citas_por_veterinario,
    obtener_mascota_por_id
)

# Crear blueprint
citas_bp = Blueprint('citas', __name__, url_prefix='/api/citas')


def token_requerido(f):
    """Decorador para verificar que el usuario está autenticado"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'usuario'):
            return jsonify({'success': False, 'mensaje': 'No autenticado'}), 401
        return f(*args, **kwargs)
    return decorated


def verificar_cita_pertenece_dueno(id_cita, id_dueno):
    """Verifica que una cita pertenece a un dueño específico"""
    cita = obtener_cita_por_id(id_cita)
    if not cita:
        return False
    
    # Obtener el dueño de la mascota de la cita
    mascota = obtener_mascota_por_id(cita.get('id_mascota'))
    if not mascota or mascota.get('id_dueno') != id_dueno:
        return False
    
    return True


# ==================== ENDPOINTS ====================

@citas_bp.route('', methods=['GET'])
@token_requerido
def listar_citas():
    """
    GET /api/citas
    Obtiene todas las citas del usuario autenticado
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        if not id_dueno:
            return jsonify({
                'success': False,
                'mensaje': 'Usuario sin perfil de dueño'
            }), 400
        
        citas = obtener_citas_por_dueno(id_dueno)
        
        # Separar citas por estado
        proximas = [c for c in citas if c.get('id_estado_cita') == 1]
        historial = [c for c in citas if c.get('id_estado_cita') != 1]
        
        return jsonify({
            'success': True,
            'cantidad_total': len(citas),
            'proximas_citas': proximas,
            'historial': historial,
            'citas': citas
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al obtener citas: {str(e)}'
        }), 500


@citas_bp.route('/<int:id_cita>', methods=['GET'])
@token_requerido
def obtener_cita(id_cita):
    """
    GET /api/citas/<id>
    Obtiene los detalles de una cita específica
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        
        # Verificar que la cita pertenece al usuario
        if not verificar_cita_pertenece_dueno(id_cita, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para acceder a esta cita'
            }), 403
        
        cita = obtener_cita_por_id(id_cita)
        
        if not cita:
            return jsonify({
                'success': False,
                'mensaje': 'Cita no encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'cita': cita
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@citas_bp.route('/agendar', methods=['POST'])
@token_requerido
def agendar_cita_nuevo():
    """
    POST /api/citas/agendar
    Agenda una nueva cita veterinaria
    
    Body:
    {
        "id_mascota": 101,
        "fecha": "2026-07-15",
        "hora": "10:30",
        "id_motivo_consulta": 1,
        "id_veterinario": 1098484890
    }
    """
    try:
        datos = request.get_json()
        id_dueno = request.usuario.get('id_dueno')
        
        # Validar campos requeridos
        campos_requeridos = ['id_mascota', 'fecha', 'hora', 'id_motivo_consulta']
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
        
        # Verificar que la mascota pertenece al usuario
        mascota = obtener_mascota_por_id(datos['id_mascota'])
        if not mascota or mascota.get('id_dueno') != id_dueno:
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para agendar cita de esta mascota'
            }), 403
        
        # Validar fecha
        try:
            fecha_obj = datetime.strptime(datos['fecha'], '%Y-%m-%d')
            if fecha_obj < datetime.now():
                return jsonify({
                    'success': False,
                    'mensaje': 'No puedes agendar citas en fechas pasadas'
                }), 400
        except ValueError:
            return jsonify({
                'success': False,
                'mensaje': 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
            }), 400
        
        # Validar hora
        try:
            hora_obj = datetime.strptime(datos['hora'], '%H:%M')
            if hora_obj.hour < 8 or hora_obj.hour >= 18:
                return jsonify({
                    'success': False,
                    'mensaje': 'El horario de atención es de 8:00 a 18:00'
                }), 400
        except ValueError:
            return jsonify({
                'success': False,
                'mensaje': 'Formato de hora inválido (debe ser HH:MM)'
            }), 400
        
        # Agendar cita
        resultado = agendar_cita(
            datos['id_mascota'],
            datos['fecha'],
            datos['hora'],
            datos['id_motivo_consulta'],
            datos.get('id_veterinario')
        )
        
        if not resultado.get('success'):
            return jsonify(resultado), 400
        
        cita = obtener_cita_por_id(resultado['id_cita'])
        
        return jsonify({
            'success': True,
            'mensaje': 'Cita agendada exitosamente',
            'id_cita': resultado['id_cita'],
            'cita': cita
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al agendar cita: {str(e)}'
        }), 500


@citas_bp.route('/<int:id_cita>', methods=['PUT'])
@token_requerido
def modificar_cita(id_cita):
    """
    PUT /api/citas/<id>
    Modifica una cita existente
    
    Body (opcional):
    {
        "fecha": "2026-07-16",
        "hora": "11:00",
        "id_veterinario": 1092783743
    }
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        datos = request.get_json() or {}
        
        # Verificar que la cita pertenece al usuario
        if not verificar_cita_pertenece_dueno(id_cita, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para modificar esta cita'
            }), 403
        
        # Validar fecha si se proporciona
        if 'fecha' in datos and datos['fecha']:
            try:
                fecha_obj = datetime.strptime(datos['fecha'], '%Y-%m-%d')
                if fecha_obj < datetime.now():
                    return jsonify({
                        'success': False,
                        'mensaje': 'No puedes agendar citas en fechas pasadas'
                    }), 400
            except ValueError:
                return jsonify({
                    'success': False,
                    'mensaje': 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
                }), 400
        
        # Validar hora si se proporciona
        if 'hora' in datos and datos['hora']:
            try:
                hora_obj = datetime.strptime(datos['hora'], '%H:%M')
                if hora_obj.hour < 8 or hora_obj.hour >= 18:
                    return jsonify({
                        'success': False,
                        'mensaje': 'El horario de atención es de 8:00 a 18:00'
                    }), 400
            except ValueError:
                return jsonify({
                    'success': False,
                    'mensaje': 'Formato de hora inválido (debe ser HH:MM)'
                }), 400
        
        # Actualizar cita
        resultado = actualizar_cita(
            id_cita,
            fecha=datos.get('fecha'),
            hora=datos.get('hora'),
            id_veterinario=datos.get('id_veterinario'),
            id_estado=datos.get('id_estado')
        )
        
        if not resultado.get('success'):
            return jsonify(resultado), 400
        
        cita_actualizada = obtener_cita_por_id(id_cita)
        
        return jsonify({
            'success': True,
            'mensaje': 'Cita modificada exitosamente',
            'cita': cita_actualizada
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al modificar cita: {str(e)}'
        }), 500


@citas_bp.route('/<int:id_cita>/cancelar', methods=['POST'])
@token_requerido
def cancelar_cita_endpoint(id_cita):
    """
    POST /api/citas/<id>/cancelar
    Cancela una cita
    
    Body (opcional):
    {
        "id_motivo_cancelacion": 1
    }
    """
    try:
        id_dueno = request.usuario.get('id_dueno')
        datos = request.get_json() or {}
        
        # Verificar que la cita pertenece al usuario
        if not verificar_cita_pertenece_dueno(id_cita, id_dueno):
            return jsonify({
                'success': False,
                'mensaje': 'No tienes permiso para cancelar esta cita'
            }), 403
        
        # Cancelar cita
        resultado = cancelar_cita(
            id_cita,
            datos.get('id_motivo_cancelacion')
        )
        
        if not resultado.get('success'):
            return jsonify(resultado), 400
        
        return jsonify({
            'success': True,
            'mensaje': 'Cita cancelada exitosamente'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error al cancelar cita: {str(e)}'
        }), 500


@citas_bp.route('/motivos', methods=['GET'])
@token_requerido
def listar_motivos():
    """
    GET /api/citas/motivos
    Obtiene lista de motivos de consulta
    """
    try:
        motivos = obtener_motivos_consulta()
        
        return jsonify({
            'success': True,
            'motivos': motivos,
            'cantidad': len(motivos)
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@citas_bp.route('/veterinarios', methods=['GET'])
@token_requerido
def listar_veterinarios():
    """
    GET /api/citas/veterinarios
    Obtiene lista de veterinarios disponibles
    """
    try:
        veterinarios = obtener_veterinarios()
        
        return jsonify({
            'success': True,
            'veterinarios': veterinarios,
            'cantidad': len(veterinarios)
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500


@citas_bp.route('/disponibilidad', methods=['GET'])
@token_requerido
def obtener_disponibilidad():
    """
    GET /api/citas/disponibilidad?id_veterinario=123&fecha=2026-07-15
    Obtiene horas disponibles para agendar con un veterinario en una fecha
    """
    try:
        id_veterinario = request.args.get('id_veterinario', type=int)
        fecha = request.args.get('fecha')
        
        if not id_veterinario or not fecha:
            return jsonify({
                'success': False,
                'mensaje': 'id_veterinario y fecha son requeridos'
            }), 400
        
        # Validar formato de fecha
        try:
            datetime.strptime(fecha, '%Y-%m-%d')
        except ValueError:
            return jsonify({
                'success': False,
                'mensaje': 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
            }), 400
        
        # Obtener citas del veterinario
        citas = obtener_citas_por_veterinario(id_veterinario, fecha)
        horas_ocupadas = [c['hora'] for c in citas]
        
        # Generar todas las horas disponibles (8:00 a 18:00, cada 30 min)
        horas_disponibles = []
        hora = 8
        while hora < 18:
            for minuto in ['00', '30']:
                hora_str = f"{hora:02d}:{minuto}"
                if hora_str not in horas_ocupadas:
                    horas_disponibles.append(hora_str)
            hora += 1
        
        return jsonify({
            'success': True,
            'fecha': fecha,
            'horas_disponibles': horas_disponibles,
            'horas_ocupadas': horas_ocupadas
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'mensaje': f'Error: {str(e)}'
        }), 500
