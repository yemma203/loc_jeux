-- MariaDB dump 10.19-11.1.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: loc_jeux
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `jeux`
--

DROP TABLE IF EXISTS `jeux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jeux` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jeux`
--

LOCK TABLES `jeux` WRITE;
/*!40000 ALTER TABLE `jeux` DISABLE KEYS */;
INSERT INTO `jeux` VALUES
(1,'FC24','https://www.gamereactor.fr/media/49/easportsfc_4064953b.jpg',2.00),
(2,'GTA V','https://i.ebayimg.com/images/g/j1cAAOSwzxpiOdHc/s-l1200.jpg',1.50),
(3,"Assassin\'s Creed Valhalla','https://pbs.twimg.com/amplify_video_thumb/1496892685910781955/img/2kgpEPnhPr2EoYRU.jpg",3.00),
(4,'Cyberpunk 2077','https://i.pinimg.com/originals/ef/0f/9f/ef0f9f825c6e38f34a0735321fa8dc90.jpg',1.50),
(5,'The Witcher 3: Wild Hunt','https://e.snmc.io/lk/lv/x/c35ca9f6390c44fa0a804b0c3b90a882/7130659',1.80),
(6,'Call of Duty: Warzone','https://i.pinimg.com/originals/5c/4c/b7/5c4cb7dbc525b1db74fd0e855952bae1.jpg',2.20),
(7,'Minecraft','https://news.microsoft.com/wp-content/uploads/prod/sites/113/2015/12/Minecraft_XboxOne_Keyart.png',1.50),
(8,'Red Dead Redemption 2','https://gamingspecials.co.za/wp-content/uploads/2022/07/5da85be37e696c2b755a1612.jpg',2.80),
(9,'FIFA 22','https://pbs.twimg.com/media/E56aVwIXMAI_LUC.jpg',1.00),
(10,'The Elder Scrolls V: Skyrim','https://i.ebayimg.com/images/g/proAAOSwNwNjNAo0/s-l1200.webp',1.70),
(11,'Rainbow Six Siege','https://pbs.twimg.com/media/E5JT_0yXEAInJx6.jpg',2.30);
/*!40000 ALTER TABLE `jeux` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int(11) DEFAULT NULL,
  `id_jeu` int(11) DEFAULT NULL,
  `date_sortie` timestamp NULL DEFAULT current_timestamp(),
  `duree_location` int(11) DEFAULT NULL,
  `note` int(11) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `id_jeu` (`id_jeu`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `location_ibfk_2` FOREIGN KEY (`id_jeu`) REFERENCES `jeux` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `identifiant` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-18 20:55:26
