"""
test_api.py - Tests básicos para los endpoints de TechnoPets 2.0
Para ejecutar: python -m pytest test_api.py -v
"""

import unittest
import json
from datetime import datetime, timedelta
import sys
import os

# Agregar rutas
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Backend'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Control'))

from app import app
from basededatospy import (
    registrar_usuario,
    validar_usuario,
    registrar_dueno,
    registrar_mascota
)


class TestTechnoPetsAPI(unittest.TestCase):
    """Tests de los endpoints principales"""
    
    def setUp(self):
        """Preparar cada test"""
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
        # Datos de prueba
        self.usuario_test = {
            'correo': 'test@example.com',
            'contrasena': 'password123'
        }
    
    # ==================== TESTS DE AUTENTICACIÓN ====================
    
    def test_01_salud_servidor(self):
        """Test: Verificar que el servidor está funcionando"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['mensaje'].startswith('Servidor'))
    
    def test_02_registro_usuario(self):
        """Test: Registrar un nuevo usuario"""
        datos = {
            'nombre': 'Juan Pérez',
            'correo': 'juan@example.com',
            'telefono': '3215551234',
            'contrasena': 'password123',
            'direccion': 'Calle 45',
            'mascotas': [{
                'nombre': 'Max',
                'especie': 'perro',
                'raza': 'Labrador',
                'edad': 3,
                'sexo': 'macho',
                'peso': '25kg'
            }]
        }
        
        response = self.client.post('/api/registro',
            data=json.dumps(datos),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
    
    def test_03_login_usuario(self):
        """Test: Login de usuario"""
        # Primero registrar
        datos_registro = {
            'nombre': 'Carlos López',
            'correo': 'carlos@example.com',
            'telefono': '3215552222',
            'contrasena': 'mipassword',
            'direccion': 'Calle 50',
            'mascotas': []
        }
        
        self.client.post('/api/registro',
            data=json.dumps(datos_registro),
            content_type='application/json'
        )
        
        # Ahora hacer login
        datos_login = {
            'correo': 'carlos@example.com',
            'contrasena': 'mipassword'
        }
        
        response = self.client.post('/api/login',
            data=json.dumps(datos_login),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('token', data)
    
    def test_04_login_credenciales_invalidas(self):
        """Test: Login con credenciales incorrectas"""
        datos = {
            'correo': 'noexiste@example.com',
            'contrasena': 'wrongpassword'
        }
        
        response = self.client.post('/api/login',
            data=json.dumps(datos),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
    
    # ==================== TESTS DE MASCOTAS ====================
    
    def test_05_obtener_mascotas_sin_autenticacion(self):
        """Test: No permitir acceso sin token"""
        response = self.client.get('/api/mascotas')
        self.assertEqual(response.status_code, 401)
    
    # ==================== TESTS DE CITAS ====================
    
    def test_06_obtener_citas_sin_autenticacion(self):
        """Test: No permitir acceso a citas sin token"""
        response = self.client.get('/api/citas')
        self.assertEqual(response.status_code, 401)
    
    def test_07_obtener_motivos_sin_autenticacion(self):
        """Test: No permitir acceso a motivos sin token"""
        response = self.client.get('/api/citas/motivos')
        self.assertEqual(response.status_code, 401)
    
    # ==================== TESTS DE CONSULTAS ====================
    
    def test_08_obtener_diagnosticos_sin_autenticacion(self):
        """Test: No permitir acceso a diagnósticos sin token"""
        response = self.client.get('/api/consultas/diagnosticos')
        self.assertEqual(response.status_code, 401)


class TestValidacionesBD(unittest.TestCase):
    """Tests de funciones de base de datos"""
    
    def test_01_registrar_usuario(self):
        """Test: Registrar usuario en BD"""
        resultado = registrar_usuario(
            'bdtest@example.com',
            'testpass123',
            'cliente'
        )
        
        self.assertTrue(resultado.get('success'))
        self.assertIn('id_usuario', resultado)
    
    def test_02_validar_usuario(self):
        """Test: Validar credenciales de usuario"""
        # Registrar primero
        registrar_usuario(
            'validtest@example.com',
            'correctpass',
            'cliente'
        )
        
        # Validar con credenciales correctas
        usuario = validar_usuario('validtest@example.com', 'correctpass')
        self.assertIsNotNone(usuario)
        self.assertEqual(usuario['correo'], 'validtest@example.com')
    
    def test_03_validar_usuario_invalido(self):
        """Test: Validar credenciales incorrectas"""
        usuario = validar_usuario('noexiste@example.com', 'wrongpass')
        self.assertIsNone(usuario)


class TestValidacionesInput(unittest.TestCase):
    """Tests de validaciones de entrada"""
    
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
    
    def test_01_email_invalido(self):
        """Test: Rechazar email inválido en registro"""
        datos = {
            'nombre': 'Usuario',
            'correo': 'notanemail',  # Email inválido
            'telefono': '3215551234',
            'contrasena': 'password123',
            'mascotas': []
        }
        
        response = self.client.post('/api/registro',
            data=json.dumps(datos),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
    
    def test_02_telefono_invalido(self):
        """Test: Rechazar teléfono inválido"""
        datos = {
            'nombre': 'Usuario',
            'correo': 'test@example.com',
            'telefono': '123',  # Teléfono muy corto
            'contrasena': 'password123',
            'mascotas': []
        }
        
        response = self.client.post('/api/registro',
            data=json.dumps(datos),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
    
    def test_03_contrasena_corta(self):
        """Test: Rechazar contraseña muy corta"""
        datos = {
            'nombre': 'Usuario',
            'correo': 'test@example.com',
            'telefono': '3215551234',
            'contrasena': '123',  # Menos de 6 caracteres
            'mascotas': []
        }
        
        response = self.client.post('/api/registro',
            data=json.dumps(datos),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])


if __name__ == '__main__':
    print("""
    ╔════════════════════════════════════════════════════════════════╗
    ║       Tests de TechnoPets 2.0 - Sistema de Veterinaria        ║
    ╚════════════════════════════════════════════════════════════════╝
    """)
    
    # Ejecutar tests
    unittest.main(verbosity=2)
