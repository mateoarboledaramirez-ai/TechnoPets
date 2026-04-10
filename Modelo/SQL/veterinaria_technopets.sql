-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2026 a las 06:20:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `veterinaria_technopets`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda`
--

CREATE TABLE `agenda` (
  `id_agenda` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `id_estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agenda`
--

INSERT INTO `agenda` (`id_agenda`, `fecha`, `hora_inicio`, `hora_fin`, `id_estado`) VALUES
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
(18, '2026-01-15', '08:30:00', '09:00:00', 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alergia`
--

CREATE TABLE `alergia` (
  `id_alergia` int(11) NOT NULL,
  `nombre_alergia` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alergia`
--

INSERT INTO `alergia` (`id_alergia`, `nombre_alergia`) VALUES
(1, 'Polen'),
(2, 'Alimentos'),
(3, 'Medicamentos'),
(4, 'Pulgas'),
(5, 'Polvo'),
(6, 'Moho'),
(7, 'Picaduras'),
(8, 'Lactosa'),
(9, 'Químicos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canal_recordatorio`
--

CREATE TABLE `canal_recordatorio` (
  `id_canal` int(11) NOT NULL,
  `nombre_canal` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `canal_recordatorio`
--

INSERT INTO `canal_recordatorio` (`id_canal`, `nombre_canal`) VALUES
(1, 'gmail'),
(2, 'sms');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cirugia`
--

CREATE TABLE `cirugia` (
  `id_cirugia` int(11) NOT NULL,
  `nombre_cirugia` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cirugia`
--

INSERT INTO `cirugia` (`id_cirugia`, `nombre_cirugia`) VALUES
(1, 'esterilizacion'),
(2, 'extraccion dental'),
(3, 'cirugia de pata'),
(4, 'cesarea'),
(5, 'tumor'),
(6, 'hernia'),
(7, 'ojo'),
(8, 'fractura'),
(9, 'limpieza profunda');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `id_cita` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `id_estado_cita` int(11) DEFAULT NULL,
  `id_motivo_consulta` int(11) DEFAULT NULL,
  `id_motivo_cancelacion` int(11) DEFAULT NULL,
  `multa` decimal(10,2) DEFAULT NULL,
  `id_mascota` int(11) DEFAULT NULL,
  `id_veterinario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`id_cita`, `fecha`, `hora`, `id_estado_cita`, `id_motivo_consulta`, `id_motivo_cancelacion`, `multa`, `id_mascota`, `id_veterinario`) VALUES
(3001, '2026-03-01', '08:30:00', 1, 1, NULL, 0.00, 101, 1098484890),
(3002, '2026-03-02', '09:00:00', 2, 2, NULL, 0.00, 102, 1092783743),
(3003, '2026-03-06', '10:00:00', 3, 3, 1, 30000.00, 103, 1873972738),
(3004, '2026-03-04', '11:00:00', 4, 4, NULL, 0.00, 104, 1093884757),
(3005, '2026-03-05', '08:00:00', 1, 5, NULL, 0.00, 110, 1939748578),
(3006, '2026-03-06', '09:30:00', 2, 6, NULL, 0.00, 111, 1938457585),
(3007, '2026-03-07', '10:30:00', 3, 7, 2, 30000.00, 120, 1673647367),
(3008, '2026-03-08', '11:30:00', 4, 8, NULL, 0.00, 123, 1625374654),
(3009, '2026-03-09', '08:30:00', 2, 9, NULL, 0.00, 109, 1930898585);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clinica`
--

CREATE TABLE `clinica` (
  `id_clinica` int(11) NOT NULL,
  `nombre_clinica` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clinica`
--

INSERT INTO `clinica` (`id_clinica`, `nombre_clinica`) VALUES
(1, 'consulta'),
(2, 'control'),
(3, 'cirugia'),
(4, 'vacunacion'),
(5, 'emergencia'),
(6, 'desparasitacion'),
(7, 'revision'),
(8, 'hospitalizacion'),
(9, 'terapia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consulta`
--

CREATE TABLE `consulta` (
  `id_consulta` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `temperatura` decimal(5,2) DEFAULT NULL,
  `id_diagnostico` int(11) DEFAULT NULL,
  `id_tratamiento` int(11) DEFAULT NULL,
  `id_motivo` int(11) DEFAULT NULL,
  `id_observacion` int(11) DEFAULT NULL,
  `id_veterinario` int(11) DEFAULT NULL,
  `id_mascota` int(11) DEFAULT NULL,
  `id_cita` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `consulta`
--

INSERT INTO `consulta` (`id_consulta`, `fecha`, `hora`, `temperatura`, `id_diagnostico`, `id_tratamiento`, `id_motivo`, `id_observacion`, `id_veterinario`, `id_mascota`, `id_cita`) VALUES
(301, '2026-03-01', '08:30:00', 38.50, 1, 1, 1, 1, 1098484890, 101, 3001),
(302, '2026-03-02', '09:00:00', 39.00, 2, 2, 2, 2, 1092783743, 102, 3002),
(303, '2026-03-06', '10:00:00', 38.20, 3, 3, 3, 3, 1873972738, 103, 3003),
(304, '2026-03-04', '11:00:00', 37.90, 4, 4, 4, 4, 1093884757, 104, 3004),
(305, '2026-03-05', '08:00:00', 38.70, 5, 5, 5, 5, 1939748578, 110, 3005),
(306, '2026-03-06', '09:30:00', 38.40, 6, 6, 6, 6, 1938457585, 111, 3006),
(307, '2026-03-07', '10:30:00', 39.10, 7, 7, 7, 7, 1673647367, 120, 3007),
(308, '2026-03-08', '11:30:00', 38.80, 8, 8, 8, 8, 1625374654, 123, 3008),
(309, '2026-03-09', '08:30:00', 38.30, 9, 9, 9, 9, 1930898585, 109, 3009);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico`
--

CREATE TABLE `diagnostico` (
  `id_diagnostico` int(11) NOT NULL,
  `diagnostico` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnostico`
--

INSERT INTO `diagnostico` (`id_diagnostico`, `diagnostico`) VALUES
(1, 'infeccion leve'),
(2, 'parasitos intestinales'),
(3, 'alergia en piel'),
(4, 'dolor estomacal'),
(5, 'infeccion respiratoria'),
(6, 'herida leve'),
(7, 'fiebre'),
(8, 'problema digestivo'),
(9, 'control general');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dia_horario`
--

CREATE TABLE `dia_horario` (
  `id_dia` int(11) NOT NULL,
  `nombre_dia` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dia_horario`
--

INSERT INTO `dia_horario` (`id_dia`, `nombre_dia`) VALUES
(1, 'lunes'),
(2, 'lunes'),
(3, 'martes'),
(4, 'martes'),
(5, 'miercoles'),
(6, 'miercoles'),
(7, 'jueves'),
(8, 'viernes'),
(9, 'sabado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dueno`
--

CREATE TABLE `dueno` (
  `id_dueño` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dueno`
--

INSERT INTO `dueno` (`id_dueño`, `nombre`, `telefono`, `direccion`, `email`) VALUES
(1017789801, 'Carlos', '3227890552', 'calle 22norte-5p21', 'Carloschanga@gmail.com'),
(1022344562, 'Jose', '3115263599', 'carrera 33sur-252', 'josegarcia@gmail.com'),
(1039778452, 'Natalia', '3208957589', 'calle sur 56-7s5', 'elmachooxd@gmail.com'),
(1047767644, 'Anastacia', '3224566789', 'carrera 23sur-3p40', 'lahembrapro@gmail.com'),
(1057331245, 'Jhonny', '3126678821', 'carrera 21i-85k88', 'pequejhomnny@gmail.com'),
(1069980014, 'Amanda', '3207665349', 'calle22 sur-84i 5', 'lakotonboogie@gmail.com'),
(1075654388, 'Jhonn', '3247885153', 'carrera norte-51p 45', 'elshoony43@gmail.com'),
(1086002712, 'Sawyer', '3224787083', 'calle 99sur-10i 51', 'drharleysawyer@gmail.com'),
(1096766223, 'Angel', '3078323418', 'cra 55i-51sur80', 'thebigangelofgod@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especie`
--

CREATE TABLE `especie` (
  `id_especie` int(11) NOT NULL,
  `especie` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especie`
--

INSERT INTO `especie` (`id_especie`, `especie`) VALUES
(1, 'perro'),
(2, 'gato');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_agenda`
--

CREATE TABLE `estado_agenda` (
  `id_estado` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_agenda`
--

INSERT INTO `estado_agenda` (`id_estado`, `fecha`) VALUES
(1, '2026-03-01'),
(2, '2026-03-02'),
(3, '2026-03-06'),
(4, '2026-03-04'),
(5, '2026-03-05'),
(6, '2026-03-06'),
(7, '2026-03-07'),
(8, '2026-03-08'),
(9, '2026-03-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_cita`
--

CREATE TABLE `estado_cita` (
  `id_estado` int(11) NOT NULL,
  `estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_cita`
--

INSERT INTO `estado_cita` (`id_estado`, `estado`) VALUES
(1, 'programada'),
(2, 'completa'),
(3, 'cancelada'),
(4, 'no asistio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_recordatorio`
--

CREATE TABLE `estado_recordatorio` (
  `id_estado` int(11) NOT NULL,
  `nombre_estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_recordatorio`
--

INSERT INTO `estado_recordatorio` (`id_estado`, `nombre_estado`) VALUES
(1, 'pendiente'),
(2, 'enviado'),
(3, 'fallido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `farmacia`
--

CREATE TABLE `farmacia` (
  `id_farmaco` int(11) NOT NULL,
  `id_tipo` int(11) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `dosis` varchar(100) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `farmacia`
--

INSERT INTO `farmacia` (`id_farmaco`, `id_tipo`, `nombre`, `dosis`, `fecha_vencimiento`, `cantidad`, `precio`) VALUES
(1, 1, 'Amoxicilina', '250mg', '2026-12-01', 100, 5000.00),
(2, 1, 'Metronidazol', '500mg', '2026-11-15', 80, 7000.00),
(3, 2, 'Ivermectina', '1%', '2027-01-10', 50, 12000.00),
(4, 2, 'Prazicuantel', '50mg', '2026-10-20', 60, 9000.00),
(5, 3, 'Meloxicam', '5mg', '2026-09-30', 40, 15000.00),
(6, 3, 'Tramadol', '50mg', '2026-08-25', 30, 18000.00),
(7, 4, 'Omeprazol', '20mg', '2027-02-14', 70, 6000.00),
(8, 4, 'Sucralfato', '1g', '2026-07-18', 45, 8500.00),
(9, 5, 'Hidrocortisona', '1%', '2026-11-05', 35, 11000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_alergia`
--

CREATE TABLE `historial_alergia` (
  `id_historial` int(11) NOT NULL,
  `id_alergia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_alergia`
--

INSERT INTO `historial_alergia` (`id_historial`, `id_alergia`) VALUES
(5001, 1),
(5002, 2),
(5003, 3),
(5004, 4),
(5005, 5),
(5006, 6),
(5007, 7),
(5008, 8),
(5009, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_cirugia`
--

CREATE TABLE `historial_cirugia` (
  `id_historial` int(11) NOT NULL,
  `id_cirugia` int(11) NOT NULL,
  `fecha_cirugia` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_cirugia`
--

INSERT INTO `historial_cirugia` (`id_historial`, `id_cirugia`, `fecha_cirugia`) VALUES
(5001, 1, '2024-03-12'),
(5002, 2, '2024-07-15'),
(5003, 3, '2024-08-10'),
(5004, 4, '2024-09-05'),
(5005, 5, '2024-10-18'),
(5006, 6, '2024-11-02'),
(5007, 7, '2024-12-12'),
(5008, 8, '2025-01-15'),
(5009, 9, '2025-05-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id_historial` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_mascota` int(11) DEFAULT NULL,
  `id_tipo_registro` int(11) DEFAULT NULL,
  `id_clinica` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`id_historial`, `fecha`, `id_mascota`, `id_tipo_registro`, `id_clinica`) VALUES
(5001, '2024-03-12', 101, 1, 1),
(5002, '2024-06-20', 102, 2, 2),
(5003, '2024-07-15', 103, 3, 3),
(5004, '2024-08-10', 104, 4, 4),
(5005, '2024-09-05', 109, 5, 5),
(5006, '2024-10-18', 110, 6, 6),
(5007, '2024-11-02', 111, 7, 7),
(5008, '2024-12-12', 120, 8, 8),
(5009, '2025-01-15', 123, 9, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_vacuna`
--

CREATE TABLE `historial_vacuna` (
  `id_historial` int(11) NOT NULL,
  `id_vacuna` int(11) NOT NULL,
  `fecha_aplicacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_vacuna`
--

INSERT INTO `historial_vacuna` (`id_historial`, `id_vacuna`, `fecha_aplicacion`) VALUES
(5001, 1, '2024-03-12'),
(5002, 2, '2024-07-15'),
(5003, 3, '2024-08-10'),
(5004, 4, '2024-09-05'),
(5005, 5, '2024-10-18'),
(5006, 6, '2024-11-02'),
(5007, 7, '2024-12-12'),
(5008, 8, '2025-01-15'),
(5009, 9, '2024-06-20'),
(5001, 1, '2024-03-12'),
(5002, 2, '2024-07-15'),
(5003, 3, '2024-08-10'),
(5004, 4, '2024-09-05'),
(5005, 5, '2024-10-18'),
(5006, 6, '2024-11-02'),
(5007, 7, '2024-12-12'),
(5008, 8, '2025-01-15'),
(5009, 9, '2024-06-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` int(11) NOT NULL,
  `id_recepcionista` int(11) DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `id_veterinario` int(11) DEFAULT NULL,
  `id_dia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id_horario`, `id_recepcionista`, `hora_inicio`, `hora_fin`, `id_veterinario`, `id_dia`) VALUES
(121, 601, '08:00:00', '12:00:00', 1098484890, 1),
(122, 602, '14:00:00', '18:00:00', 1092783743, 2),
(123, 603, '09:00:00', '13:00:00', 1873972738, 3),
(124, 604, '14:00:00', '17:00:00', 1093884757, 4),
(125, 605, '08:00:00', '12:00:00', 1939748578, 5),
(126, 606, '13:00:00', '16:00:00', 1938457585, 6),
(127, 607, '10:00:00', '14:00:00', 1673647367, 7),
(128, 608, '08:00:00', '12:00:00', 1625374654, 8),
(129, 609, '09:00:00', '13:00:00', 1930898585, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `id_mascota` int(11) NOT NULL,
  `nombre_mascota` varchar(100) NOT NULL,
  `id_especie` int(11) DEFAULT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `peso` varchar(20) DEFAULT NULL,
  `id_dueño` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`id_mascota`, `nombre_mascota`, `id_especie`, `raza`, `edad`, `sexo`, `peso`, `id_dueño`) VALUES
(101, 'max', 1, 'pitbull', 5, 'macho', '28kg', 1017789801),
(102, 'luna', 2, 'siames', 3, 'hembra', '4kg', 1022344562),
(103, 'rocky', 1, 'bulldog', 4, 'macho', '20kg', 1039778452),
(104, 'mara', 2, 'persa', 2, 'hembra', '3kg', 1047767644),
(109, 'toby', 1, 'pastor aleman', 1, 'macho', '17kg', 1057331245),
(110, 'milo', 2, 'criollo', 4, 'macho', '5kg', 1069980014),
(111, 'kiara', 1, 'labrador', 6, 'hembra', '25kg', 1075654388),
(120, 'simba', 2, 'angora', 3, 'macho', '4kg', 1086002712),
(123, 'coco', 1, 'criollo', 2, 'macho', '21kg', 1096766223);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int(11) NOT NULL,
  `metodo_pago` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodo_pago`, `metodo_pago`) VALUES
(1, 'efectivo'),
(2, 'tarjeta'),
(3, 'tranferencia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo`
--

CREATE TABLE `motivo` (
  `id_motivo` int(11) NOT NULL,
  `motivo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motivo`
--

INSERT INTO `motivo` (`id_motivo`, `motivo`) VALUES
(1, 'Tos frecuente'),
(2, 'Vómito'),
(3, 'Picazón'),
(4, 'Falta de apetito'),
(5, 'Estornudos'),
(6, 'Herida en pata'),
(7, 'Decaimiento'),
(8, 'Diarrea'),
(9, 'Revisión general');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo_cancelacion`
--

CREATE TABLE `motivo_cancelacion` (
  `id_motivo` int(11) NOT NULL,
  `motivo_cancelacion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motivo_cancelacion`
--

INSERT INTO `motivo_cancelacion` (`id_motivo`, `motivo_cancelacion`) VALUES
(1, 'problema familiar'),
(2, 'mascota enferma'),
(3, 'emergencia personal'),
(4, 'error en la cita');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo_consulta`
--

CREATE TABLE `motivo_consulta` (
  `id_motivo` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motivo_consulta`
--

INSERT INTO `motivo_consulta` (`id_motivo`, `motivo`) VALUES
(1, 'vacunacion anual'),
(2, 'revision general'),
(3, 'esterilizacion'),
(4, 'desparacitacion'),
(5, 'control postoperatorio'),
(6, 'consulta por vomito'),
(7, 'limpieza dental'),
(8, 'vacuna antirrabica'),
(9, 'revision por alergia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `observaciones`
--

CREATE TABLE `observaciones` (
  `id_observacion` int(11) NOT NULL,
  `observacion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `observaciones`
--

INSERT INTO `observaciones` (`id_observacion`, `observacion`) VALUES
(1, 'Reposo en casa'),
(2, 'Control en 1 semana'),
(3, 'Evitar polvo'),
(4, 'Dieta blanda'),
(5, 'Control en 3 días'),
(6, 'Vigilar cicatrización'),
(7, 'Reposo'),
(8, 'Hidratación'),
(9, 'Mascota saludable');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL,
  `id_cita` int(11) DEFAULT NULL,
  `id_metodo_pago` int(11) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id_pago`, `id_cita`, `id_metodo_pago`, `monto`, `fecha`) VALUES
(1, 3001, 1, 40000.00, '2026-03-01'),
(2, 3002, 2, 80000.00, '2026-03-02'),
(3, 3003, 3, 150000.00, '2026-03-06'),
(4, 3004, 1, 100000.00, '2026-03-04'),
(5, 3005, 2, 200000.00, '2026-03-05'),
(6, 3006, 3, 90000.00, '2026-03-06'),
(7, 3007, 1, 50000.00, '2026-03-07'),
(8, 3008, 2, 70000.00, '2026-03-08'),
(9, 3009, 3, 90000.00, '2026-03-09'),
(10, 3001, 2, 95000.00, '2026-03-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_servicios`
--

CREATE TABLE `pago_servicios` (
  `id_pago` int(11) NOT NULL,
  `id_servicios` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago_servicios`
--

INSERT INTO `pago_servicios` (`id_pago`, `id_servicios`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 1),
(7, 2),
(8, 3),
(9, 4),
(10, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recepcionista`
--

CREATE TABLE `recepcionista` (
  `id_recepcionista` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Activo',
  `fecha_ultimo_recordatorio` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recepcionista`
--

INSERT INTO `recepcionista` (`id_recepcionista`, `nombre`, `telefono`, `email`, `fecha_registro`, `estado`, `fecha_ultimo_recordatorio`) VALUES
(601, 'Carlos', '3227890552', 'carloschanga@gmail.com', '2024-04-05', 'Activo', '2023-12-30'),
(602, 'Jose', '3115263599', 'josegarcia@gmail.com', '2023-12-30', 'Activo', '2024-04-23'),
(603, 'Natalia', '3208957589', 'elmachooxd@gmail.com', '2024-11-23', 'Inactivo', '2025-09-08'),
(604, 'Anastacia', '3224566789', 'lahembrapro@gmail.com', '2025-09-21', 'Activo', '2026-01-03'),
(605, 'Jhonny', '3126678821', 'pequejhomnny@gmail.com', '2026-02-17', 'Activo', '2026-02-17'),
(606, 'Amanda', '3207665349', 'lakotonboogie@gmail.com', '2023-09-30', 'Activo', '2023-12-23'),
(607, 'Camilo', '3208495884', 'camilo@gmail.com', '2024-05-12', 'Inactivo', '2024-04-24'),
(608, 'Junior', '3142536267', 'junior0@gmail.com', '2023-09-29', 'Activo', '2025-09-10'),
(609, 'Alfonso', '3241728368', 'alfonso90@gmail.com', '2026-01-25', 'Activo', '2026-01-15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recordatorio`
--

CREATE TABLE `recordatorio` (
  `id_recordatorio` int(11) NOT NULL,
  `id_cita` int(11) DEFAULT NULL,
  `fecha_envio` date NOT NULL,
  `id_tipo` int(11) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL,
  `canal` varchar(10) DEFAULT 'gmail'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recordatorio`
--

INSERT INTO `recordatorio` (`id_recordatorio`, `id_cita`, `fecha_envio`, `id_tipo`, `id_estado`, `canal`) VALUES
(901, 3001, '2026-03-01', 1, 1, 'gmail'),
(902, 3002, '2026-03-02', 2, 2, 'sms'),
(903, 3003, '2026-03-06', 3, 3, 'gmail'),
(904, 3004, '2026-03-04', 4, 1, 'sms'),
(905, 3005, '2026-03-05', 5, 1, 'gmail'),
(906, 3006, '2026-03-06', 6, 2, 'gmail'),
(907, 3007, '2026-03-07', 7, 1, 'sms'),
(908, 3008, '2026-03-08', 8, 1, 'gmail'),
(909, 3009, '2026-03-09', 9, 2, 'sms');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`, `estado`) VALUES
(1, 'Administrador', 'Activo'),
(2, 'Veterinario', 'Activo'),
(3, 'Recepcionista', 'Activo'),
(4, 'Auxiliar veterinario', 'Activo'),
(5, 'Contador', 'Activo'),
(6, 'Administrador de sistema', 'Activo'),
(7, 'Encargado de inventario', 'Activo'),
(8, 'Cajero', 'Activo'),
(9, 'Supervisor', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_detalle`
--

CREATE TABLE `rol_detalle` (
  `id_rol` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_detalle`
--

INSERT INTO `rol_detalle` (`id_rol`, `descripcion`) VALUES
(1, 'Encargado de la gestión general del sistema.'),
(2, 'Responsable de la atención médica de las mascotas.'),
(3, 'Encargado de la atención al cliente y gestión de citas.'),
(4, 'Apoya en las actividades clínicas y cuidado de las mascotas.'),
(5, 'Encargado de gestionar la contabilidad, ingresos, egresos y reportes financieros de la veterinaria.'),
(6, 'Responsable del mantenimiento del sistema, gestión de usuarios, seguridad y correcto funcionamiento del software.'),
(7, 'Controla el stock de medicamentos, insumos y productos, asegurando su disponibilidad y registro actualizado.'),
(8, 'Gestiona los cobros de servicios y productos, emite facturas y registra las transacciones diarias.'),
(9, 'Supervisa las operaciones generales, verifica el cumplimiento de procesos y apoya la toma de decisiones.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicios` int(11) NOT NULL,
  `nombre_servicios` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_servicios`, `nombre_servicios`) VALUES
(1, 'consulta general'),
(2, 'vacunacion'),
(3, 'cirugia'),
(4, 'desparacitacion'),
(5, 'control postoperatorio'),
(6, 'peluqueria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_medicamento`
--

CREATE TABLE `tipo_medicamento` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_medicamento`
--

INSERT INTO `tipo_medicamento` (`id_tipo`, `nombre_tipo`) VALUES
(1, 'antibiotico'),
(2, 'antiparasitario'),
(3, 'analgesico'),
(4, 'gastroprotector'),
(5, 'corticoide'),
(6, 'vitamina'),
(7, 'antiinflamatorio'),
(8, 'vacuna'),
(9, 'antiseptico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_recordatorio`
--

CREATE TABLE `tipo_recordatorio` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_recordatorio`
--

INSERT INTO `tipo_recordatorio` (`id_tipo`, `nombre_tipo`) VALUES
(1, 'Vacunación'),
(2, 'Revisión'),
(3, 'Esterilización'),
(4, 'Desparasitación'),
(5, 'Control'),
(6, 'Limpieza dental'),
(7, 'Vacuna antirrabica'),
(8, 'Revisión por alergia'),
(9, 'Control postoperatorio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_registro`
--

CREATE TABLE `tipo_registro` (
  `id_tipo_registro` int(11) NOT NULL,
  `nombre_registro` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_registro`
--

INSERT INTO `tipo_registro` (`id_tipo_registro`, `nombre_registro`) VALUES
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
(14, 'Limpieza profunda');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamiento`
--

CREATE TABLE `tratamiento` (
  `id_tratamiento` int(11) NOT NULL,
  `tratamiento` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tratamiento`
--

INSERT INTO `tratamiento` (`id_tratamiento`, `tratamiento`) VALUES
(1, 'antibiotico por 5 dias'),
(2, 'desparasitacion'),
(3, 'crema dermatologica'),
(4, 'protector gastrico'),
(5, 'antibiótico'),
(6, 'limpieza y antibiotico'),
(7, 'Antiinflamatorio'),
(8, 'Medicamento digestivo'),
(9, 'Vitaminas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacuna`
--

CREATE TABLE `vacuna` (
  `id_vacuna` int(11) NOT NULL,
  `nombre_vacuna` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vacuna`
--

INSERT INTO `vacuna` (`id_vacuna`, `nombre_vacuna`) VALUES
(1, 'Rabia'),
(2, 'Moquillo'),
(3, 'Parvovirus'),
(4, 'Hepatitis'),
(5, 'Leptospirosis'),
(6, 'Influenza canina'),
(7, 'Bordetella'),
(8, 'Triple felina'),
(9, 'Leucemia felina');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `veterinario`
--

CREATE TABLE `veterinario` (
  `id_veterinario` int(11) NOT NULL,
  `nombre_veterinario` varchar(100) NOT NULL,
  `especialidad` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `veterinario`
--

INSERT INTO `veterinario` (`id_veterinario`, `nombre_veterinario`, `especialidad`, `telefono`, `correo`) VALUES
(1098484890, 'Dr. Carlos Pérez', 'Medicina general', '3245735734', 'carlos@veterinaria.com'),
(1092783743, 'Dra. Laura Gómez', 'Dermatologia', '3125635477', 'laura@veterinaria.com'),
(1873972738, 'Dr. Andrés Torres', 'Cirugía veterinaria', '3095784673', 'andres@veterinaria.com'),
(1093884757, 'Dra. Mariana Ruiz', 'Medicina interna', '3119632876', 'mariana@veterinaria.com'),
(1939748578, 'Dr. Feliple Castro', 'Cardiología veterinaria', '3105706765', 'felipe@veterinaria.com'),
(1938457585, 'Dra. Natalia Herrera', 'Urgencias veterinarias', '3212411186', 'natalia@veterinaria.com'),
(1673647367, 'Dr. Sebastian Lopez', 'Medicina general', '3144770703', 'sebastian@veterinaria.com'),
(1625374654, 'Dra. Daniela Vargas', 'Nutrición animal', '3134827221', 'daniela@veterinaria.com'),
(1930898585, 'Dr. Juan Medina', 'Medicina preventiva', '3012411540', 'juan@veterinaria.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canal_recordatorio`
--
ALTER TABLE `canal_recordatorio`
  ADD PRIMARY KEY (`id_canal`);

--
-- Indices de la tabla `farmacia`
--
ALTER TABLE `farmacia`
  ADD PRIMARY KEY (`id_farmaco`),
  ADD KEY `farmacia_ibfk_1` (`id_tipo`);

--
-- Indices de la tabla `tipo_medicamento`
--
ALTER TABLE `tipo_medicamento`
  ADD PRIMARY KEY (`id_tipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canal_recordatorio`
--
ALTER TABLE `canal_recordatorio`
  MODIFY `id_canal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `farmacia`
--
ALTER TABLE `farmacia`
  MODIFY `id_farmaco` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tipo_medicamento`
--
ALTER TABLE `tipo_medicamento`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `farmacia`
--
ALTER TABLE `farmacia`
  ADD CONSTRAINT `farmacia_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_medicamento` (`id_tipo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
