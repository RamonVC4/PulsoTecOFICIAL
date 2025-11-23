-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-11-2025 a las 01:34:46
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
create database pulsotec;
use pulsotec;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor`
--

CREATE TABLE `autor` (
  `id` int(11) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `contra` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autor`
--

INSERT INTO `autor` (`id`, `correo`, `contra`) VALUES
(1, 'autor@example.com', '$2y$10$qg38C6UnJKu7oMuToFSSHe1KVIq2HSG.GQ98qPT7Z3BqW/NmEvjR.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor_proyecto`
--

CREATE TABLE `autor_proyecto` (
  `idAutor` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manager`
--

CREATE TABLE `manager` (
  `id` int(11) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `contra` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revisor`
--

CREATE TABLE `revisor` (
  `id` int(11) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `contra` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `revisor`
--

INSERT INTO `revisor` (`id`, `correo`, `contra`) VALUES
(1, 'revisor@example.com', '$2y$10$rDR7XxcDruOiYFv1bwWXYe/MxRXNpe6gogrEqK8OLiRuQ6DV4Jcma'),
(2, 'revisor2@example.com', '$3y$10$rDR7XxcDruOiYFv1bwWXYe/MxRXNpe6gogrEqK8OLiRuQ6DV4Jcma');

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autor`
--
ALTER TABLE `autor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `entrega`
--
ALTER TABLE `entrega`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `manager`
--
ALTER TABLE `manager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `revisor`
--
ALTER TABLE `revisor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
