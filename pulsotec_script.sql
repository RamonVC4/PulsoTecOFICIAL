-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-11-2025 a las 19:52:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pulsotec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor`
--

CREATE TABLE `autor` (
  `id` int(11) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `contra` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `primerApellido` varchar(100) NOT NULL,
  `segundoApellido` varchar(100) DEFAULT NULL,
  `institucion` varchar(150) DEFAULT NULL,
  `ORCID` varchar(19) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `calle` varchar(150) DEFAULT NULL,
  `numeroDeCalle` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autor`
--

INSERT INTO `autor` (`id`, `correo`, `contra`, `nombre`, `primerApellido`, `segundoApellido`, `institucion`, `ORCID`, `estado`, `ciudad`, `calle`, `numeroDeCalle`, `colonia`) VALUES
(1, 'autor@example.com', '$2y$10$qg38C6UnJKu7oMuToFSSHe1KVIq2HSG.GQ98qPT7Z3BqW/NmEvjR.', 'test1', 'testApellido1', 'testApellido2', 'A', '123456789', 'Durango', 'ciudad de Durango', 'calle test', '123', 'colonia test'),
(2, 'autor@example.com', '$2y$10$Czyw.OLDP8O7.L2Gy3jJ9e5vfugBiXhdElA5EvsD0aUHoCAya0tQ.', 'autor test 2', 'test primer apellido 2', 'test segundo apellido 2', 'institucion test', '12345678', 'Guanajuato', 'ciudad de Guanajuato', 'calle test 2', '123', 'colonia test 2'),
(3, 'as@gmail.com', '$2y$10$n1dPEQR0/L7HQKX.1heZB.AyHfWys9/1ENjfaibop36kgnXgoO6Oa', 'as', 'torres', 'torre', 'ITL', '123456789012345X', 'Coahuila', 'Torreon', 'asd', NULL, 'asd'),
(5, 'munoz@gmail.com', 'qwertyuiop', 'Antonio de Jesús', 'Muñoz', 'Muñoz', 'Instituto Tecnológico de la Laguna', '12345678901234X', 'Coahuila', 'Torreón', 'Cabo Pulmo', '172', 'Nueva California'),
(6, 'ramon@gmail.com', '123456789', 'Ramon', 'Villa', 'Nueva', 'Instituto Tecnológico de la Laguna', '12345678901234X', 'Coahuila', 'Torreón', 'Cabo Pulmo DOS', '173', 'Nueva California DOS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor_proyecto`
--

CREATE TABLE `autor_proyecto` (
  `idAutor` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autor_proyecto`
--

INSERT INTO `autor_proyecto` (`idAutor`, `idProyecto`) VALUES
(1, 1),
(1, 2),
(1, 3),
(5, 4),
(6, 4),
(5, 5),
(6, 5),
(5, 6),
(6, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrega`
--

CREATE TABLE `entrega` (
  `id` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `numeroEntrega` int(11) NOT NULL,
  `entregado` tinyint(1) DEFAULT NULL,
  `aceptado` tinyint(1) DEFAULT NULL,
  `pdfPath` varchar(255) DEFAULT NULL,
  `fechaLimite` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrega`
--

INSERT INTO `entrega` (`id`, `idProyecto`, `numeroEntrega`, `entregado`, `aceptado`, `pdfPath`, `fechaLimite`) VALUES
(1, 1, 1, 1, 1, '../uploads/6920c5bbc58f3-Documentacion de programa de manejo de cadenas.pdf', '2025-11-21'),
(2, 2, 1, 1, NULL, '../uploads/6920c5c9e6fa9-Documentacion de programa de manejo de cadenas.pdf', '2025-11-21'),
(3, 3, 1, 1, 1, '../uploads/testword.docx', '2025-11-21'),
(4, 4, 1, 1, 1, '../uploads/6929c9112fef0-Documentacion de programa de manejo de cadenas.docx', '2025-11-28'),
(5, 5, 1, 1, NULL, '../uploads/6929ca5037085-PROBLEMA AFD.docx', '2025-11-28'),
(6, 6, 1, 1, NULL, '../uploads/6929df28c5841-test.docx', '2025-11-28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manager`
--

CREATE TABLE `manager` (
  `id` int(11) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `contra` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manager`
--

INSERT INTO `manager` (`id`, `correo`, `contra`) VALUES
(1, 'managertest@gmail.com', '12345678');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `areaDeConocimiento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyecto`
--

INSERT INTO `proyecto` (`id`, `nombre`, `areaDeConocimiento`) VALUES
(1, 'estudio cientifico', 0),
(2, 'mejor estudio cientifico', 0),
(3, 'test', 0),
(4, 'aef', 0),
(5, 'AAAAAAAA', 0),
(6, 'proyecto 2', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revisor`
--

CREATE TABLE `revisor` (
  `id` int(11) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `contra` varchar(255) NOT NULL,
  `curp` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `primerApellido` varchar(255) NOT NULL,
  `segundoApellido` varchar(255) NOT NULL,
  `areaDeConocimiento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `revisor`
--

INSERT INTO `revisor` (`id`, `correo`, `contra`, `curp`, `nombre`, `primerApellido`, `segundoApellido`, `areaDeConocimiento`) VALUES
(1, 'revisor@example.com', '$2y$10$rDR7XxcDruOiYFv1bwWXYe/MxRXNpe6gogrEqK8OLiRuQ6DV4Jcma', 'MUMAHCLXXNA2', '', '', '', 0),
(2, 'revisor@example.com', '$2y$10$cIfTDFL4LaIOhmZAeBc/uOPDwqhZgQ58ACs3FJbEvWL5M2vNsn9uS', '', '', '', '', 0),
(3, 'asd', 'asd', 'asd', 'RAAAA', 'asd', 'asd', 2),
(4, 'asd', 'asd', 'asd', 'RAAAA', 'asd', 'asd', 2),
(5, 'a@gmail.com', '$2y$10$lm.tT28L./AnDSKedJ7lL.wROIGV8TBs5xksGNiBYpto/bnrsZVEq', 'MUMA051025HCLXX', 'jose', 'torres', 'torres', 6),
(6, 'agusto@gmail.com', 'qazwsxedc', 'MUMA051025HCLXX', 'Agustín', 'Reyes', 'Castillo', 4),
(7, 'agunstin2@gmail.com', '12345678', 'MUMA051025HCLXX', 'Agustin2', 'Torres', 'Torres', 8),
(8, 'agustin3@gmail.com', '12345678', 'MUMA051025HCLXX', 'agustin3', 'Torres', 'Torres', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revisor_proyecto`
--

CREATE TABLE `revisor_proyecto` (
  `idRevisor` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `datos` text NOT NULL,
  `fechaLimite` date DEFAULT NULL,
  `terminado` tinyint(1) DEFAULT 0,
  `idEntrega` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `revisor_proyecto`
--

INSERT INTO `revisor_proyecto` (`idRevisor`, `idProyecto`, `datos`, `fechaLimite`, `terminado`, `idEntrega`) VALUES
(1, 1, '{\"documentId\":\"..\\/uploads\\/6920c5bbc58f3-Documentacion de programa de manejo de cadenas.pdf\",\"observaciones[]\":\"extension\",\"aspecto01\":\"excelente\",\"aspecto02\":\"excelente\",\"aspecto03\":\"excelente\",\"aspecto04\":\"bueno\",\"aspecto05\":\"bueno\",\"calificacion_global\":\"9.0\",\"dictamen\":\"aceptar_sin_cambios\",\"comentarios_autores\":\"afsafa\"}', '2025-11-26', 1, 1),
(5, 3, '{\"documentId\":\"..\\/uploads\\/testword.docx\",\"calificacion_global\":\"\",\"dictamen\":\"aceptar_sin_cambios\",\"comentarios_autores\":\"bien hecho\"}', '2025-11-28', 1, 3),
(6, 4, '{}', '2025-12-31', 0, NULL),
(7, 4, '{}', '2025-12-31', 0, NULL),
(8, 4, '{\"documentId\":\"..\\/uploads\\/6929c9112fef0-Documentacion de programa de manejo de cadenas.docx\",\"calificacion_global\":\"\",\"dictamen\":\"aceptar_sin_cambios\",\"comentarios_autores\":\"Bien hecho\\n\"}', '2025-12-31', 1, NULL),
(8, 6, '{}', '2025-12-31', 0, NULL),
(7, 6, '{}', '2025-12-31', 0, NULL),
(6, 6, '{}', '2025-12-31', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revisor_veredicto`
--

CREATE TABLE `revisor_veredicto` (
  `idRevisor` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `revisor_veredicto`
--

INSERT INTO `revisor_veredicto` (`idRevisor`, `idProyecto`, `status`) VALUES
(5, 3, 1),
(6, 4, NULL),
(7, 4, NULL),
(8, 4, 1),
(8, 6, NULL),
(7, 6, NULL),
(6, 6, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autor`
--
ALTER TABLE `autor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `autor_proyecto`
--
ALTER TABLE `autor_proyecto`
  ADD KEY `idAutor` (`idAutor`),
  ADD KEY `idProyecto` (`idProyecto`);

--
-- Indices de la tabla `entrega`
--
ALTER TABLE `entrega`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idProyecto` (`idProyecto`);

--
-- Indices de la tabla `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `revisor`
--
ALTER TABLE `revisor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `revisor_proyecto`
--
ALTER TABLE `revisor_proyecto`
  ADD KEY `idRevisor` (`idRevisor`),
  ADD KEY `idProyecto` (`idProyecto`),
  ADD KEY `fk_idEntrega` (`idEntrega`);

--
-- Indices de la tabla `revisor_veredicto`
--
ALTER TABLE `revisor_veredicto`
  ADD KEY `idRevisor` (`idRevisor`),
  ADD KEY `idProyecto` (`idProyecto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autor`
--
ALTER TABLE `autor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `entrega`
--
ALTER TABLE `entrega`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `manager`
--
ALTER TABLE `manager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `revisor`
--
ALTER TABLE `revisor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `autor_proyecto`
--
ALTER TABLE `autor_proyecto`
  ADD CONSTRAINT `autor_proyecto_ibfk_1` FOREIGN KEY (`idAutor`) REFERENCES `autor` (`id`),
  ADD CONSTRAINT `autor_proyecto_ibfk_2` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`id`);

--
-- Filtros para la tabla `entrega`
--
ALTER TABLE `entrega`
  ADD CONSTRAINT `entrega_ibfk_1` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`id`);

--
-- Filtros para la tabla `revisor_proyecto`
--
ALTER TABLE `revisor_proyecto`
  ADD CONSTRAINT `fk_idEntrega` FOREIGN KEY (`idEntrega`) REFERENCES `entrega` (`id`),
  ADD CONSTRAINT `revisor_proyecto_ibfk_1` FOREIGN KEY (`idRevisor`) REFERENCES `revisor` (`id`),
  ADD CONSTRAINT `revisor_proyecto_ibfk_2` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`id`);

--
-- Filtros para la tabla `revisor_veredicto`
--
ALTER TABLE `revisor_veredicto`
  ADD CONSTRAINT `revisor_veredicto_ibfk_1` FOREIGN KEY (`idRevisor`) REFERENCES `revisor` (`id`),
  ADD CONSTRAINT `revisor_veredicto_ibfk_2` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
