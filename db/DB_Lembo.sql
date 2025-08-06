use lembo;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: lembo
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ciclos`
--

DROP TABLE IF EXISTS `ciclos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `duracion` varchar(50) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclos`
--

LOCK TABLES `ciclos` WRITE;
/*!40000 ALTER TABLE `ciclos` DISABLE KEYS */;
INSERT INTO `ciclos` VALUES (1,'Ciclo Primavera','3 meses','2025-05-01 14:33:53'),(2,'Ciclo Verano','4 meses','2025-05-01 14:33:53'),(3,'Ciclo Invierno','2 meses','2025-05-01 14:33:53'),(6,'jordan','dsadasd','2025-05-06 07:18:08');
/*!40000 ALTER TABLE `ciclos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cultivos`
--

DROP TABLE IF EXISTS `cultivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cultivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `ubicacion` enum('Parcela 3','Parcela 5','Invernadero Norte','Invernadero Central') NOT NULL,
  `descripcion` text,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cultivos`
--

LOCK TABLES `cultivos` WRITE;
/*!40000 ALTER TABLE `cultivos` DISABLE KEYS */;
INSERT INTO `cultivos` VALUES (1,1,'Lechuga Romana','Hortaliza','Parcela 3','Cultivo resistente al frío','2025-05-01 14:34:08','lechuga.jpg'),(2,1,'Tomate Cherry','Fruta','Invernadero Norte','Requiere alta humedad','2025-05-01 14:34:08','tomate.jpg'),(3,2,'Pimiento','Hortaliza','Invernadero Central','Buen rendimiento en verano','2025-05-01 14:34:08','pimiento.jpg');
/*!40000 ALTER TABLE `cultivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumos`
--

DROP TABLE IF EXISTS `insumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `cantidad` int NOT NULL,
  `unidad` enum('kilo','gramos','pascal','metros') NOT NULL,
  `descripcion` text,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumos`
--

LOCK TABLES `insumos` WRITE;
/*!40000 ALTER TABLE `insumos` DISABLE KEYS */;
INSERT INTO `insumos` VALUES (1,'Fertilizante NPK',25.50,99,'kilo','Aporta nitrógeno, fósforo','2025-05-01 15:10:40'),(2,'Agua Potable',0.10,9999,'metros','Uso de riego por goteo','2025-05-01 15:10:40'),(3,'Insecticida Orgánico',15.75,49,'gramos','Control de plagas sin químicos fuertes','2025-05-01 15:10:40'),(4,'agua',2132.00,3123,'kilo','312asdad','2025-05-06 06:47:19');
/*!40000 ALTER TABLE `insumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturas_sensor`
--

DROP TABLE IF EXISTS `lecturas_sensor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturas_sensor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `produccion_id` varchar(20) DEFAULT NULL,
  `sensor_id` int DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `valor` decimal(12,2) NOT NULL,
  `unidad` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `produccion_id` (`produccion_id`),
  KEY `sensor_id` (`sensor_id`),
  CONSTRAINT `lecturas_sensor_ibfk_1` FOREIGN KEY (`produccion_id`) REFERENCES `producciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lecturas_sensor_ibfk_2` FOREIGN KEY (`sensor_id`) REFERENCES `sensores` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturas_sensor`
--

LOCK TABLES `lecturas_sensor` WRITE;
/*!40000 ALTER TABLE `lecturas_sensor` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturas_sensor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produccion_insumos`
--

DROP TABLE IF EXISTS `produccion_insumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produccion_insumos` (
  `produccion_id` varchar(20) NOT NULL,
  `insumo_id` int NOT NULL,
  PRIMARY KEY (`produccion_id`,`insumo_id`),
  KEY `insumo_id` (`insumo_id`),
  CONSTRAINT `produccion_insumos_ibfk_1` FOREIGN KEY (`produccion_id`) REFERENCES `producciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `produccion_insumos_ibfk_2` FOREIGN KEY (`insumo_id`) REFERENCES `insumos` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produccion_insumos`
--

LOCK TABLES `produccion_insumos` WRITE;
/*!40000 ALTER TABLE `produccion_insumos` DISABLE KEYS */;
INSERT INTO `produccion_insumos` VALUES ('PROD-481636',1),('PROD-481636',2),('PROD-481636',3);
/*!40000 ALTER TABLE `produccion_insumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produccion_sensores`
--

DROP TABLE IF EXISTS `produccion_sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produccion_sensores` (
  `produccion_id` varchar(20) NOT NULL,
  `sensor_id` int NOT NULL,
  PRIMARY KEY (`produccion_id`,`sensor_id`),
  KEY `sensor_id` (`sensor_id`),
  CONSTRAINT `produccion_sensores_ibfk_1` FOREIGN KEY (`produccion_id`) REFERENCES `producciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `produccion_sensores_ibfk_2` FOREIGN KEY (`sensor_id`) REFERENCES `sensores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produccion_sensores`
--

LOCK TABLES `produccion_sensores` WRITE;
/*!40000 ALTER TABLE `produccion_sensores` DISABLE KEYS */;
INSERT INTO `produccion_sensores` VALUES ('PROD-481636',1),('PROD-481636',2);
/*!40000 ALTER TABLE `produccion_sensores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producciones`
--

DROP TABLE IF EXISTS `producciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producciones` (
  `id` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `responsable_id` int NOT NULL,
  `cultivo_id` int NOT NULL,
  `ciclo_id` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `inversion` decimal(14,2) NOT NULL DEFAULT '0.00',
  `meta` decimal(14,2) NOT NULL DEFAULT '0.00',
  `estado` enum('activo','inactivo','borrador') NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `responsable_id` (`responsable_id`),
  KEY `cultivo_id` (`cultivo_id`),
  KEY `ciclo_id` (`ciclo_id`),
  CONSTRAINT `producciones_ibfk_1` FOREIGN KEY (`responsable_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `producciones_ibfk_2` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivos` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `producciones_ibfk_3` FOREIGN KEY (`ciclo_id`) REFERENCES `ciclos` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producciones`
--

LOCK TABLES `producciones` WRITE;
/*!40000 ALTER TABLE `producciones` DISABLE KEYS */;
INSERT INTO `producciones` VALUES ('PROD-481636','agua',1,1,1,'2025-05-01','2025-05-22',4337.50,5638.75,'activo','2025-05-01 16:38:29','2025-05-01 16:38:29');
/*!40000 ALTER TABLE `producciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensores`
--

DROP TABLE IF EXISTS `sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_sensor` enum('luz','movimiento','temperatura','humedad') NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  `tiempo_muestreo` int DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensores`
--

LOCK TABLES `sensores` WRITE;
/*!40000 ALTER TABLE `sensores` DISABLE KEYS */;
INSERT INTO `sensores` VALUES (1,'movimiento','habilitado','Sensor Temp 01','°C',14,NULL,'Sensor ubicado en Parcela 3'),(2,'humedad','habilitado','Sensor Humedad 01','%',40,NULL,'Sensor en Invernadero Norte'),(3,'luz','habilitado','Sensor Luz 01','lux',21,NULL,'Sensor ubicado en Invernadero Central');
/*!40000 ALTER TABLE `sensores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uso_insumos`
--

DROP TABLE IF EXISTS `uso_insumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uso_insumos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `produccion_id` varchar(20) DEFAULT NULL,
  `insumo_id` int DEFAULT NULL,
  `fecha` date NOT NULL,
  `cantidad` decimal(12,2) NOT NULL,
  `responsable_id` int NOT NULL,
  `valor_unitario` decimal(12,2) NOT NULL,
  `valor_total` decimal(14,2) NOT NULL,
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `produccion_id` (`produccion_id`),
  KEY `insumo_id` (`insumo_id`),
  KEY `responsable_id` (`responsable_id`),
  CONSTRAINT `uso_insumos_ibfk_1` FOREIGN KEY (`produccion_id`) REFERENCES `producciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uso_insumos_ibfk_2` FOREIGN KEY (`insumo_id`) REFERENCES `insumos` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `uso_insumos_ibfk_3` FOREIGN KEY (`responsable_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uso_insumos`
--

LOCK TABLES `uso_insumos` WRITE;
/*!40000 ALTER TABLE `uso_insumos` DISABLE KEYS */;
/*!40000 ALTER TABLE `uso_insumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `numero_telefonico` varchar(15) DEFAULT NULL,
  `rol` enum('usuario','admin','personal de apoyo') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','Sistema','123456723','admin'),(2,'Andres','reyes','32224342424','admin'),(3,'manolo','perez','322286789','personal de apoyo'),(4,'felipe','alexander','3189234562','usuario'),(5,'juan','felipe soto','3145457892','usuario'),(7,'Andres','reyes','32224342424','personal de apoyo'),(8,'Andres','reyes','32224342424','admin'),(9,'Andres','reyes','32224342424','admin'),(10,'Andres','reyes','32224342424','admin'),(11,'Andres','reyes','32224342424','admin'),(12,'Andres','reyes','32224342424','admin'),(13,'mateo','perez','355555542','personal de apoyo'),(14,'Jordan','Valencia','3011186124','usuario');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-06  2:42:21