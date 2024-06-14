-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: app_incidencias
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `estados`
--

DROP TABLE IF EXISTS `estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_estado` (`nombre_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados`
--

LOCK TABLES `estados` WRITE;
/*!40000 ALTER TABLE `estados` DISABLE KEYS */;
INSERT INTO `estados` VALUES (1,'En proceso'),(2,'Error, faltan datos'),(3,'Resuelto');
/*!40000 ALTER TABLE `estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidencias`
--

DROP TABLE IF EXISTS `incidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencias` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `asunto` varchar(250) NOT NULL,
  `tipo_incidencia_id` int NOT NULL,
  `ubicacion_incidencia` varchar(250) NOT NULL,
  `descripcion` text NOT NULL,
  `residente_id` binary(16) NOT NULL,
  `estado_id` int DEFAULT (1),
  `fecha_creacion` datetime NOT NULL DEFAULT (now()),
  `archivo_imagen` text,
  PRIMARY KEY (`id`),
  KEY `tipo_incidencia_id` (`tipo_incidencia_id`),
  KEY `residente_id` (`residente_id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `incidencias_ibfk_1` FOREIGN KEY (`tipo_incidencia_id`) REFERENCES `tipos_incidencias` (`id`),
  CONSTRAINT `incidencias_ibfk_2` FOREIGN KEY (`residente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `incidencias_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidencias`
--

LOCK TABLES `incidencias` WRITE;
/*!40000 ALTER TABLE `incidencias` DISABLE KEYS */;
INSERT INTO `incidencias` VALUES (_binary '1°\Â$*;\Ô©\/tJ“ö','focos malogrados',2,'piso 5','los focos fallan en el pasillo del piso 5',_binary 'oæ\„u)\È\Ô©\/tJ“ö',3,'2024-06-14 05:45:19','94b6f7e5-24dd-464a-86d2-14de37e5cb83.png'),(_binary '†—ù*?\Ô©\/tJ“ö','limpieza areas comunes',5,'azotea','la azotea lleva sucio varios dias',_binary '\"\∆8)\Ì\Ô©\/tJ“ö',1,'2024-06-14 06:17:04','d120505e-05a6-49c9-b9e6-665f87c8dcab.jpg'),(_binary '\◊rz*9\Ô©\/tJ“ö','grifo averiados',1,'Departamento 12','los grifos de los ba√±o gotean',_binary 'oæ\„u)\È\Ô©\/tJ“ö',1,'2024-06-14 05:35:38',NULL);
/*!40000 ALTER TABLE `incidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `nombre_rol` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (_binary 'ï\'ﬁå(\Ÿ\ÔØ;\/tJ“ö','administrador'),(_binary 'ï(ª@(\Ÿ\ÔØ;\/tJ“ö','residente');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_incidencias`
--

DROP TABLE IF EXISTS `tipos_incidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_incidencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_incidencias` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_incidencias` (`nombre_incidencias`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_incidencias`
--

LOCK TABLES `tipos_incidencias` WRITE;
/*!40000 ALTER TABLE `tipos_incidencias` DISABLE KEYS */;
INSERT INTO `tipos_incidencias` VALUES (2,'Electricidad'),(1,'Fontaner√≠a'),(9,'Gesti√≥n de emergencias'),(8,'Gesti√≥n de residuos'),(5,'Higiene y limpieza'),(4,'Mantenimiento'),(10,'Otras'),(6,'Pisos y estructura'),(3,'Seguridad'),(7,'Transporte y estacionamiento');
/*!40000 ALTER TABLE `tipos_incidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `nombre_usuario` varchar(250) NOT NULL,
  `nombre_completo` varchar(250) NOT NULL,
  `dni` varchar(30) NOT NULL,
  `correo` varchar(250) NOT NULL,
  `contrase√±a` varchar(250) NOT NULL,
  `telefono` varchar(200) DEFAULT NULL,
  `rol_id` binary(16) DEFAULT (uuid_to_bin(_utf8mb4'9528bb40-28d9-11ef-af3b-f02f744ad29a')),
  `foto_perfil` text DEFAULT (_utf8mb4'defaultProfilePicture.jpg'),
  `fecha_creacion` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `correo` (`correo`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (_binary '\"\∆8)\Ì\Ô©\/tJ“ö','test2','test2','87654321','test2@test.com','$2b$10$PJxvKi8xwsgE18g8eaCyDe1Jgm51O6n68mhoZ24gmCrJ9exegcGzm',NULL,_binary 'ï(ª@(\Ÿ\ÔØ;\/tJ“ö','6d775196-694c-4034-8328-8227e1036171.jpeg','2024-06-13 20:26:24'),(_binary 'oæ\„u)\È\Ô©\/tJ“ö','test1','test1','65743219','test1@test.com','$2b$10$PSbYg8gw9wQwigHM4YRpm.XWPNXEoDU95joKLMJpakR0wyNqDlhr2',NULL,_binary 'ï\'ﬁå(\Ÿ\ÔØ;\/tJ“ö','defaultProfilePicture.jpg','2024-06-13 20:00:05'),(_binary '\Œ\\úπ)\Á\Ô©\/tJ“ö','admin','admin','9999999','admin@admin.com','$2b$10$rIF1vMvo4YAxnFCLf0CpCuqem00yisWrWYGgilBSjO5UxUs0/Ex4i',NULL,_binary 'ï\'ﬁå(\Ÿ\ÔØ;\/tJ“ö','defaultProfilePicture.jpg','2024-06-13 19:48:24');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'app_incidencias'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-14  9:03:31
