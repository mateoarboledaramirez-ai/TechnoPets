
import sqlite3


def crear_tablas():
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS agenda (
            id_agenda INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            fecha DATE NOT NULL,
            hora_inicio TIME NOT NULL,
            hora_fin TIME NOT NULL,
            id_estado INTEGER DEFAULT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS alergia (
            id_alergia INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nombre_alergia TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS dueno (
            id_dueno INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            direccion TEXT NOT NULL,
            email TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS especie (
            id_especie INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            especie TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS clinica (
            id_clinica INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nombre_clinica TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS cirugia (
            id_cirugia INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nombre_cirugia TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS diagnostico (
            id_diagnostico INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            diagnostico TEXT NOT NULL
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS dia_horario (
            id_dia INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nombre_dia TEXT NOT NULL
        )
        ''')

conexion = sqlite3.connect('database.db')
cursor = conexion.cursor()

if __name__ == '__main__':
    crear_tablas()
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS mascota (
  id_mascota INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nombre_mascota TEXT NOT NULL,
  id_especie INTEGER DEFAULT NULL,
  raza TEXT,
  edad INTEGER,
  sexo TEXT,
  peso TEXT,
  id_dueno INTEGER DEFAULT NULL,
  FOREIGN KEY(id_especie) REFERENCES especie(id_especie),
  FOREIGN KEY(id_dueno) REFERENCES dueno(id_dueno)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS cita (
  id_cita INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  id_estado_cita INTEGER DEFAULT NULL,
  id_motivo_consulta INTEGER DEFAULT NULL,
  id_motivo_cancelacion INTEGER DEFAULT NULL,
  multa DECIMAL(10,2) DEFAULT NULL,
  id_mascota INTEGER DEFAULT NULL,
  id_veterinario INTEGER DEFAULT NULL,
  FOREIGN KEY(id_estado_cita) REFERENCES estado_cita(id_estado),
  FOREIGN KEY(id_motivo_consulta) REFERENCES motivo_consulta(id_motivo),
  FOREIGN KEY(id_motivo_cancelacion) REFERENCES motivo_cancelacion(id_motivo),
  FOREIGN KEY(id_mascota) REFERENCES mascota(id_mascota),
  FOREIGN KEY(id_veterinario) REFERENCES veterinario(id_veterinario)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS consulta (
  id_consulta INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  temperatura DECIMAL(5,2) DEFAULT NULL,
  id_diagnostico INTEGER DEFAULT NULL,
  id_tratamiento INTEGER DEFAULT NULL,
  id_motivo INTEGER DEFAULT NULL,
  id_observacion INTEGER DEFAULT NULL,
  id_veterinario INTEGER DEFAULT NULL,
  id_mascota INTEGER DEFAULT NULL,
  id_cita INTEGER DEFAULT NULL,
  FOREIGN KEY(id_diagnostico) REFERENCES diagnostico(id_diagnostico),
  FOREIGN KEY(id_tratamiento) REFERENCES tratamiento(id_tratamiento),
  FOREIGN KEY(id_motivo) REFERENCES motivo(id_motivo),
  FOREIGN KEY(id_observacion) REFERENCES observaciones(id_observacion),
  FOREIGN KEY(id_veterinario) REFERENCES veterinario(id_veterinario),
  FOREIGN KEY(id_mascota) REFERENCES mascota(id_mascota),
  FOREIGN KEY(id_cita) REFERENCES cita(id_cita)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS historial_medico (
  id_historial INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  fecha DATE NOT NULL,
  id_mascota INTEGER DEFAULT NULL,
  id_tipo_registro INTEGER DEFAULT NULL,
  id_clinica INTEGER DEFAULT NULL,
  FOREIGN KEY(id_mascota) REFERENCES mascota(id_mascota),
  FOREIGN KEY(id_tipo_registro) REFERENCES tipo_registro(id_tipo_registro),
  FOREIGN KEY(id_clinica) REFERENCES clinica(id_clinica)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS historial_alergia (
  id_historial INTEGER NOT NULL,
  id_alergia INTEGER NOT NULL,
  PRIMARY KEY(id_historial, id_alergia),
  FOREIGN KEY(id_historial) REFERENCES historial_medico(id_historial),
  FOREIGN KEY(id_alergia) REFERENCES alergia(id_alergia)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS historial_cirugia (
  id_historial INTEGER NOT NULL,
  id_cirugia INTEGER NOT NULL,
  fecha_cirugia DATE DEFAULT NULL,
  PRIMARY KEY(id_historial, id_cirugia),
  FOREIGN KEY(id_historial) REFERENCES historial_medico(id_historial),
  FOREIGN KEY(id_cirugia) REFERENCES cirugia(id_cirugia)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS historial_vacuna (
  id_historial INTEGER NOT NULL,
  id_vacuna INTEGER NOT NULL,
  fecha_aplicacion DATE,
  PRIMARY KEY(id_historial, id_vacuna),
  FOREIGN KEY(id_historial) REFERENCES historial_medico(id_historial),
  FOREIGN KEY(id_vacuna) REFERENCES vacuna(id_vacuna)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS horarios (
  id_horario INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  id_recepcionista INTEGER DEFAULT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  id_veterinario INTEGER DEFAULT NULL,
  id_dia INTEGER DEFAULT NULL,
  FOREIGN KEY(id_recepcionista) REFERENCES recepcionista(id_recepcionista),
  FOREIGN KEY(id_veterinario) REFERENCES veterinario(id_veterinario),
  FOREIGN KEY(id_dia) REFERENCES dia_horario(id_dia)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS estado_cita (
  id_estado INTEGER PRIMARY KEY NOT NULL,
  estado TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS motivo (
  id_motivo INTEGER PRIMARY KEY NOT NULL,
  motivo TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS motivo_consulta (
  id_motivo INTEGER PRIMARY KEY NOT NULL,
  motivo TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS motivo_cancelacion (
  id_motivo INTEGER PRIMARY KEY NOT NULL,
  motivo_cancelacion TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS observaciones (
  id_observacion INTEGER PRIMARY KEY NOT NULL,
  observacion TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS veterinario (
  id_veterinario INTEGER PRIMARY KEY NOT NULL,
  nombre_veterinario TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  telefono TEXT NOT NULL,
  correo TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS vacuna (
  id_vacuna INTEGER PRIMARY KEY NOT NULL,
  nombre_vacuna TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS tratamiento (
  id_tratamiento INTEGER PRIMARY KEY NOT NULL,
  tratamiento TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS metodo_pago (
  id_metodo_pago INTEGER PRIMARY KEY NOT NULL,
  metodo_pago TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS servicios (
  id_servicios INTEGER PRIMARY KEY NOT NULL,
  nombre_servicios TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS recepcionista (
  id_recepcionista INTEGER PRIMARY KEY NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha_registro DATE NOT NULL,
  estado TEXT NOT NULL,
  fecha_ultimo_recordatorio DATE NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS estado_recordatorio (
  id_estado INTEGER PRIMARY KEY NOT NULL,
  nombre_estado TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS tipo_recordatorio (
  id_tipo INTEGER PRIMARY KEY NOT NULL,
  nombre_tipo TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS tipo_registro (
  id_tipo_registro INTEGER PRIMARY KEY NOT NULL,
  nombre_registro TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS estado_agenda (
  id_estado INTEGER PRIMARY KEY NOT NULL,
  fecha DATE NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS pago (
  id_pago INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  id_cita INTEGER DEFAULT NULL,
  id_metodo_pago INTEGER DEFAULT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha DATE NOT NULL,
  FOREIGN KEY(id_cita) REFERENCES cita(id_cita),
  FOREIGN KEY(id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS pago_servicios (
  id_pago INTEGER NOT NULL,
  id_servicios INTEGER NOT NULL,
  PRIMARY KEY(id_pago, id_servicios),
  FOREIGN KEY(id_pago) REFERENCES pago(id_pago),
  FOREIGN KEY(id_servicios) REFERENCES servicios(id_servicios)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS recordatorio (
  id_recordatorio INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  id_cita INTEGER NOT NULL,
  fecha_envio DATE NOT NULL,
  id_tipo INTEGER NOT NULL,
  id_estado INTEGER NOT NULL,
  canal TEXT NOT NULL,
  FOREIGN KEY(id_cita) REFERENCES cita(id_cita),
  FOREIGN KEY(id_tipo) REFERENCES tipo_recordatorio(id_tipo),
  FOREIGN KEY(id_estado) REFERENCES estado_recordatorio(id_estado)
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS rol (
  id_rol INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nombre TEXT NOT NULL,
  estado TEXT NOT NULL
)
''')
conexion.commit()

cursor.execute('''
CREATE TABLE IF NOT EXISTS rol_detalle (
  id_rol INTEGER PRIMARY KEY NOT NULL,
  descripcion TEXT NOT NULL,
  FOREIGN KEY(id_rol) REFERENCES rol(id_rol)
)
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO agenda (id_agenda, fecha, hora_inicio, hora_fin, id_estado) VALUES
(1, '2026-03-01', '08:00:00', '08:30:00', 1),
(2, '2026-03-02', '08:30:00', '09:00:00', 2),
(3, '2026-03-06', '09:00:00', '09:30:00', 3),
(4, '2026-03-04', '10:00:00', '10:30:00', 4),
(5, '2026-03-05', '08:00:00', '08:30:00', 5),
(6, '2026-03-06', '07:00:00', '07:30:00', 6),
(7, '2026-03-07', '09:30:00', '10:00:00', 7),
(8, '2026-03-08', '10:00:00', '10:30:00', 8),
(9, '2026-03-09', '08:00:00', '08:30:00', 9),
(10, '2023-12-30', '08:00:00', '08:30:00', 1),
(11, '2024-04-23', '09:00:00', '09:30:00', 2),
(12, '2025-09-08', '10:00:00', '10:30:00', 3),
(13, '2026-01-03', '08:30:00', '09:00:00', 4),
(14, '2026-02-17', '11:00:00', '11:30:00', 5),
(15, '2023-12-23', '09:00:00', '09:30:00', 6),
(16, '2024-04-24', '08:00:00', '08:30:00', 7),
(17, '2025-09-10', '10:30:00', '11:00:00', 8),
(18, '2026-01-15', '08:30:00', '09:00:00', 9)
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO alergia (id_alergia, nombre_alergia) VALUES
(1, 'Polen'),
(2, 'Alimentos'),
(3, 'Medicamentos'),
(4, 'Pulgas'),
(5, 'Polvo'),
(6, 'Moho'),
(7, 'Picaduras'),
(8, 'Lactosa'),
(9, 'Químicos')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO cirugia (id_cirugia, nombre_cirugia) VALUES
(1, 'esterilizacion'),
(2, 'extraccion dental'),
(3, 'cirugia de pata'),
(4, 'cesarea'),
(5, 'tumor'),
(6, 'hernia'),
(7, 'ojo'),
(8, 'fractura'),
(9, 'limpieza profunda')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO clinica (id_clinica, nombre_clinica) VALUES
(1, 'consulta'),
(2, 'control'),
(3, 'cirugia'),
(4, 'vacunacion'),
(5, 'emergencia'),
(6, 'desparasitacion'),
(7, 'revision'),
(8, 'hospitalizacion'),
(9, 'terapia')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO estado_agenda (id_estado, fecha) VALUES
(1, '2026-03-01'),
(2, '2026-03-02'),
(3, '2026-03-06'),
(4, '2026-03-04'),
(5, '2026-03-05'),
(6, '2026-03-06'),
(7, '2026-03-07'),
(8, '2026-03-08'),
(9, '2026-03-09')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO estado_cita (id_estado, estado) VALUES
(1, 'programada'),
(2, 'completa'),
(3, 'cancelada'),
(4, 'no asistio')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO estado_recordatorio (id_estado, nombre_estado) VALUES
(1, 'pendiente'),
(2, 'enviado'),
(3, 'fallido')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO tipo_recordatorio (id_tipo, nombre_tipo) VALUES
(1, 'Vacunación'),
(2, 'Revisión'),
(3, 'Esterilización'),
(4, 'Desparasitación'),
(5, 'Control'),
(6, 'Limpieza dental'),
(7, 'Vacuna antirrabica'),
(8, 'Revisión por alergia'),
(9, 'Control postoperatorio')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO motivo (id_motivo, motivo) VALUES
(1, 'Tos frecuente'),
(2, 'Vómito'),
(3, 'Picazón'),
(4, 'Falta de apetito'),
(5, 'Estornudos'),
(6, 'Herida en pata'),
(7, 'Decaimiento'),
(8, 'Diarrea'),
(9, 'Revisión general')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO motivo_consulta (id_motivo, motivo) VALUES
(1, 'vacunacion anual'),
(2, 'revision general'),
(3, 'esterilizacion'),
(4, 'desparacitacion'),
(5, 'control postoperatorio'),
(6, 'consulta por vomito'),
(7, 'limpieza dental'),
(8, 'vacuna antirrabica'),
(9, 'revision por alergia')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO motivo_cancelacion (id_motivo, motivo_cancelacion) VALUES
(1, 'problema familiar'),
(2, 'mascota enferma'),
(3, 'emergencia personal'),
(4, 'error en la cita')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO observaciones (id_observacion, observacion) VALUES
(1, 'Reposo en casa'),
(2, 'Control en 1 semana'),
(3, 'Evitar polvo'),
(4, 'Dieta blanda'),
(5, 'Control en 3 días'),
(6, 'Vigilar cicatrización'),
(7, 'Reposo'),
(8, 'Hidratación'),
(9, 'Mascota saludable')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO dueno (id_dueno, nombre, telefono, direccion, email) VALUES
(1017789801, 'Carlos', '3227890552', 'calle 22norte-5p21', 'Carloschanga@gmail.com'),
(1022344562, 'Jose', '3115263599', 'carrera 33sur-252', 'josegarcia@gmail.com'),
(1039778452, 'Natalia', '3208957589', 'calle sur 56-7s5', 'elmachooxd@gmail.com'),
(1047767644, 'Anastacia', '3224566789', 'carrera 23sur-3p40', 'lahembrapro@gmail.com'),
(1057331245, 'Jhonny', '3126678821', 'carrera 21i-85k88', 'pequejhomnny@gmail.com'),
(1069980014, 'Amanda', '3207665349', 'calle22 sur-84i 5', 'lakotonboogie@gmail.com'),
(1075654388, 'Jhonn', '3247885153', 'carrera norte-51p 45', 'elshoony43@gmail.com'),
(1086002712, 'Sawyer', '3224787083', 'calle 99sur-10i 51', 'drharleysawyer@gmail.com'),
(1096766223, 'Angel', '3078323418', 'cra 55i-51sur80', 'thebigangelofgod@gmail.com')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO especie (id_especie, especie) VALUES
(1, 'perro'),
(2, 'gato')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO veterinario (id_veterinario, nombre_veterinario, especialidad, telefono, correo) VALUES
(1098484890, 'Dr. Carlos Pérez', 'Medicina general', '3245735734', 'carlos@veterinaria.com'),
(1092783743, 'Dra. Laura Gómez', 'Dermatologia', '3125635477', 'laura@veterinaria.com'),
(1873972738, 'Dr. Andrés Torres', 'Cirugía veterinaria', '3095784673', 'andres@veterinaria.com'),
(1093884757, 'Dra. Mariana Ruiz', 'Medicina interna', '3119632876', 'mariana@veterinaria.com'),
(1939748578, 'Dr. Feliple Castro', 'Cardiología veterinaria', '3105706765', 'felipe@veterinaria.com'),
(1938457585, 'Dra. Natalia Herrera', 'Urgencias veterinarias', '3212411186', 'natalia@veterinaria.com'),
(1673647367, 'Dr. Sebastian Lopez', 'Medicina general', '3144770703', 'sebastian@veterinaria.com'),
(1625374654, 'Dra. Daniela Vargas', 'Nutrición animal', '3134827221', 'daniela@veterinaria.com'),
(1930898585, 'Dr. Juan Medina', 'Medicina preventiva', '3012411540', 'juan@veterinaria.com')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO mascota (id_mascota, nombre_mascota, id_especie, raza, edad, sexo, peso, id_dueno) VALUES
(101, 'max', 1, 'pitbull', 5, 'macho', '28kg', 1017789801),
(102, 'luna', 2, 'siames', 3, 'hembra', '4kg', 1022344562),
(103, 'rocky', 1, 'bulldog', 4, 'macho', '20kg', 1039778452),
(104, 'mara', 2, 'persa', 2, 'hembra', '3kg', 1047767644),
(109, 'toby', 1, 'pastor aleman', 1, 'macho', '17kg', 1057331245),
(110, 'milo', 2, 'criollo', 4, 'macho', '5kg', 1069980014),
(111, 'kiara', 1, 'labrador', 6, 'hembra', '25kg', 1075654388),
(120, 'simba', 2, 'angora', 3, 'macho', '4kg', 1086002712),
(123, 'coco', 1, 'criollo', 2, 'macho', '21kg', 1096766223)
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO cita (id_cita, fecha, hora, id_estado_cita, id_motivo_consulta, id_motivo_cancelacion, multa, id_mascota, id_veterinario) VALUES
(3001, '2026-03-01', '08:30:00', 1, 1, NULL, 0.00, 101, 1098484890),
(3002, '2026-03-02', '09:00:00', 2, 2, NULL, 0.00, 102, 1092783743),
(3003, '2026-03-06', '10:00:00', 3, 3, 1, 30000.00, 103, 1873972738),
(3004, '2026-03-04', '11:00:00', 4, 4, NULL, 0.00, 104, 1093884757),
(3005, '2026-03-05', '08:00:00', 1, 5, NULL, 0.00, 110, 1939748578),
(3006, '2026-03-06', '09:30:00', 2, 6, NULL, 0.00, 111, 1938457585),
(3007, '2026-03-07', '10:30:00', 3, 7, 2, 30000.00, 120, 1673647367),
(3008, '2026-03-08', '11:30:00', 4, 8, NULL, 0.00, 123, 1625374654),
(3009, '2026-03-09', '08:30:00', 2, 9, NULL, 0.00, 109, 1930898585)
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO consulta (id_consulta, fecha, hora, temperatura, id_diagnostico, id_tratamiento, id_motivo, id_observacion, id_veterinario, id_mascota, id_cita) VALUES
(301, '2026-03-01', '08:30:00', 38.50, 1, 1, 1, 1, 1098484890, 101, 3001),
(302, '2026-03-02', '09:00:00', 39.00, 2, 2, 2, 2, 1092783743, 102, 3002),
(303, '2026-03-06', '10:00:00', 38.20, 3, 3, 3, 3, 1873972738, 103, 3003),
(304, '2026-03-04', '11:00:00', 37.90, 4, 4, 4, 4, 1093884757, 104, 3004),
(305, '2026-03-05', '08:00:00', 38.70, 5, 5, 5, 5, 1939748578, 110, 3005),
(306, '2026-03-06', '09:30:00', 38.40, 6, 6, 6, 6, 1938457585, 111, 3006),
(307, '2026-03-07', '10:30:00', 39.10, 7, 7, 7, 7, 1673647367, 120, 3007),
(308, '2026-03-08', '11:30:00', 38.80, 8, 8, 8, 8, 1625374654, 123, 3008),
(309, '2026-03-09', '08:30:00', 38.30, 9, 9, 9, 9, 1930898585, 109, 3009)
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO vacuna (id_vacuna, nombre_vacuna) VALUES
(1, 'Rabia'),
(2, 'Moquillo'),
(3, 'Parvovirus'),
(4, 'Hepatitis'),
(5, 'Leptospirosis'),
(6, 'Influenza canina'),
(7, 'Bordetella'),
(8, 'Triple felina'),
(9, 'Leucemia felina')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO tratamiento (id_tratamiento, tratamiento) VALUES
(1, 'antibiotico por 5 dias'),
(2, 'desparasitacion'),
(3, 'crema dermatologica'),
(4, 'protector gastrico'),
(5, 'antibiótico'),
(6, 'limpieza y antibiotico'),
(7, 'Antiinflamatorio'),
(8, 'Medicamento digestivo'),
(9, 'Vitaminas')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO metodo_pago (id_metodo_pago, metodo_pago) VALUES
(1, 'efectivo'),
(2, 'tarjeta'),
(3, 'tranferencia')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO servicios (id_servicios, nombre_servicios) VALUES
(1, 'consulta general'),
(2, 'vacunacion'),
(3, 'cirugia'),
(4, 'desparacitacion'),
(5, 'control postoperatorio'),
(6, 'peluqueria')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO pago (id_pago, id_cita, id_metodo_pago, monto, fecha) VALUES
(1, 3001, 1, 40000.00, '2026-03-01'),
(2, 3002, 2, 80000.00, '2026-03-02'),
(3, 3003, 3, 150000.00, '2026-03-06'),
(4, 3004, 1, 100000.00, '2026-03-04'),
(5, 3005, 2, 200000.00, '2026-03-05'),
(6, 3006, 3, 90000.00, '2026-03-06'),
(7, 3007, 1, 50000.00, '2026-03-07'),
(8, 3008, 2, 70000.00, '2026-03-08'),
(9, 3009, 3, 90000.00, '2026-03-09'),
(10, 3001, 2, 95000.00, '2026-03-11')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO pago_servicios (id_pago, id_servicios) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 1),
(7, 2),
(8, 3),
(9, 4),
(10, 6)
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO recepcionista (id_recepcionista, nombre, telefono, email, fecha_registro, estado, fecha_ultimo_recordatorio) VALUES
(601, 'Carlos', '3227890552', 'carloschanga@gmail.com', '2024-04-05', 'Activo', '2023-12-30'),
(602, 'Jose', '3115263599', 'josegarcia@gmail.com', '2023-12-30', 'Activo', '2024-04-23'),
(603, 'Natalia', '3208957589', 'elmachooxd@gmail.com', '2024-11-23', 'Inactivo', '2025-09-08'),
(604, 'Anastacia', '3224566789', 'lahembrapro@gmail.com', '2025-09-21', 'Activo', '2026-01-03'),
(605, 'Jhonny', '3126678821', 'pequejhomnny@gmail.com', '2026-02-17', 'Activo', '2026-02-17'),
(606, 'Amanda', '3207665349', 'lakotonboogie@gmail.com', '2023-09-30', 'Activo', '2023-12-23'),
(607, 'Camilo', '3208495884', 'camilo@gmail.com', '2024-05-12', 'Inactivo', '2024-04-24'),
(608, 'Junior', '3142536267', 'junior0@gmail.com', '2023-09-29', 'Activo', '2025-09-10'),
(609, 'Alfonso', '3241728368', 'alfonso90@gmail.com', '2026-01-25', 'Activo', '2026-01-15')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO rol (id_rol, nombre, estado) VALUES
(1, 'Administrador', 'Activo'),
(2, 'Veterinario', 'Activo'),
(3, 'Recepcionista', 'Activo'),
(4, 'Auxiliar veterinario', 'Activo'),
(5, 'Contador', 'Activo'),
(6, 'Administrador de sistema', 'Activo'),
(7, 'Encargado de inventario', 'Activo'),
(8, 'Cajero', 'Activo'),
(9, 'Supervisor', 'Activo')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO rol_detalle (id_rol, descripcion) VALUES
(1, 'Encargado de la gestión general del sistema.'),
(2, 'Responsable de la atención médica de las mascotas.'),
(3, 'Encargado de la atención al cliente y gestión de citas.'),
(4, 'Apoya en las actividades clínicas y cuidado de las mascotas.'),
(5, 'Encargado de gestionar la contabilidad, ingresos, egresos y reportes financieros de la veterinaria.'),
(6, 'Responsable del mantenimiento del sistema, gestión de usuarios, seguridad y correcto funcionamiento del software.'),
(7, 'Controla el stock de medicamentos, insumos y productos, asegurando su disponibilidad y registro actualizado.'),
(8, 'Gestiona los cobros de servicios y productos, emite facturas y registra las transacciones diarias.'),
(9, 'Supervisa las operaciones generales, verifica el cumplimiento de procesos y apoya la toma de decisiones.')
''')
conexion.commit()

cursor.execute('''
INSERT OR IGNORE INTO tipo_registro (id_tipo_registro, nombre_registro) VALUES
(1, 'Alergia'),
(2, 'Alimentos'),
(3, 'Medicamentos'),
(4, 'Cirugía'),
(5, 'Vacunación'),
(6, 'Emergencia'),
(7, 'Desparasitación'),
(8, 'Revisión'),
(9, 'Hospitalización'),
(10, 'Esterilización'),
(11, 'Extracción dental'),
(12, 'Cirugía de pata'),
(13, 'Cesárea'),
(14, 'Limpieza profunda')
''')
conexion.commit()




























def consultar_citas_con_mascota_veterinario_y_estado():
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        cursor.execute('''
            SELECT c.id_cita,
                   c.fecha,
                   c.hora,
                   m.nombre_mascota,
                   v.nombre_veterinario,
                   ec.estado
            FROM cita c
            INNER JOIN mascota m ON c.id_mascota = m.id_mascota
            INNER JOIN veterinario v ON c.id_veterinario = v.id_veterinario
            INNER JOIN estado_cita ec ON c.id_estado_cita = ec.id_estado
        ''')
        return cursor.fetchall()


def consultar_consultas_con_mascota_veterinario_y_diagnostico():
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        cursor.execute('''
            SELECT co.id_consulta,
                   co.fecha,
                   co.hora,
                   m.nombre_mascota,
                   v.nombre_veterinario,
                   d.diagnostico
            FROM consulta co
            INNER JOIN mascota m ON co.id_mascota = m.id_mascota
            INNER JOIN veterinario v ON co.id_veterinario = v.id_veterinario
            INNER JOIN diagnostico d ON co.id_diagnostico = d.id_diagnostico
        ''')
        return cursor.fetchall()


def consultar_pagos_con_cita_y_metodo():
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        cursor.execute('''
            SELECT p.id_pago,
                   p.monto,
                   p.fecha,
                   c.fecha AS fecha_cita,
                   c.hora AS hora_cita,
                   mp.metodo_pago
            FROM pago p
            INNER JOIN cita c ON p.id_cita = c.id_cita
            INNER JOIN metodo_pago mp ON p.id_metodo_pago = mp.id_metodo_pago
        ''')
        return cursor.fetchall()


def consultar_mascotas_con_duenos_y_especie():
    with sqlite3.connect('database.db') as conexion:
        cursor = conexion.cursor()
        cursor.execute('''
            SELECT m.id_mascota,
                   m.nombre_mascota,
                   d.nombre AS nombre_dueno,
                   e.especie AS especie
            FROM mascota m
            INNER JOIN dueno d ON m.id_dueno = d.id_dueno
            INNER JOIN especie e ON m.id_especie = e.id_especie
        ''')
        return cursor.fetchall()


if __name__ == '__main__':
    print('Mascotas con dueños y especie:')
    for fila in consultar_mascotas_con_duenos_y_especie():
        print(fila)

    print('\nCitas con mascota, veterinario y estado:')
    for fila in consultar_citas_con_mascota_veterinario_y_estado():
        print(fila)

    print('\nConsultas con mascota, veterinario y diagnóstico:')
    for fila in consultar_consultas_con_mascota_veterinario_y_diagnostico():
        print(fila)

    print('\nPagos con cita y método:')
    for fila in consultar_pagos_con_cita_y_metodo():
        print(fila)

