-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 31 jan. 2022 à 16:25
-- Version du serveur : 10.4.22-MariaDB
-- Version de PHP : 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tabibi`
--

-- --------------------------------------------------------

--
-- Structure de la table `praticienspecialite`
--

CREATE TABLE `praticienspecialite` (
  `id_spe` smallint(6) NOT NULL,
  `id_speCat` varchar(10) NOT NULL,
  `specialite` varchar(150) DEFAULT NULL,
  `titre` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `praticienspecialite`
--

INSERT INTO `praticienspecialite` (`id_spe`, `id_speCat`, `specialite`, `titre`) VALUES
(43, 'G_MEDC', 'Médecine générale', 'Médecin généraliste'),
(44, 'S_PEDI', 'Pédiatrie', 'Pédiatre'),
(45, 'S_CARD', 'Cardiologie', 'Cardiologue'),
(46, 'S_MINT', 'Médecine-interne', 'Spécialiste en médecine interne'),
(47, 'S_DERM', 'Dermatologie', 'Dermatologue'),
(48, 'S_GAST', 'Gastro-entéro-proctologie', 'Gastro-entérologue et hépatologue'),
(49, 'S_NEPH', 'Nephrologie', 'Néphrologue'),
(50, 'S_NEUR', 'Neurologie', 'Neurologue'),
(51, 'S_PSYC', 'Psychiatrie', 'Psychiatre'),
(52, 'S_ENDI', 'Endocrino-diabétologie', 'Diabétologue et endocrinologue'),
(53, 'S_RHUM', 'Rhumatologie', 'Rhumatologue'),
(54, 'S_ANRE', 'Anesthésie-reanimation', 'Anesthésiste réanimateur'),
(55, 'S_RATH', 'Radiothérapie', 'Radiothérapeute'),
(56, 'S_ONCO', 'Oncologie medicale-chimiothérapie', 'Oncologue'),
(57, 'S_PNEU', 'Pneumophtisiologie', 'Pneumologue'),
(58, 'S_READ', 'Readaptation-physiothérapie (Médecine physique)	 ', 'Physiothérapeute'),
(59, 'S_RADI', 'Radiologie', 'Radiologue'),
(60, 'C_GENE', 'Chirurgie générale', 'Chirurgien général'),
(61, 'C_PEDI', 'Chirurgie Pediatrique', 'Chirurgien pédiatre'),
(62, 'C_VAPE', 'Chirurgie vasculaire péripherique', 'Chirurgien vasculaire'),
(63, 'C_CAVA', 'Chirurgie cardio-vasculaire', 'Cardiologue'),
(64, 'C_TROR', 'Traumatologie-Orthopédique', 'Chirurgien orthopédiste'),
(65, 'C_ORLM', 'ORL-maxillofacial', 'ORL'),
(66, 'C_THOR', 'Chirurgie thoracique', 'Chirurgien thoracique et cardio-vasculaire'),
(67, 'C_UROL', 'Chirurgie urologique', 'Chirurgien urologue'),
(68, 'C_OPHT', 'Ophtalamologie', 'Ophtalmologue'),
(69, 'C_GYOB', 'Gynécologie-Obstétrique', 'gynécologue'),
(70, 'C_NEUR', 'Neurochirurgie', 'Neurochirurgien'),
(71, 'S_BIOL', 'Biologie', 'Médecin biologiste'),
(72, 'S_ANAT', 'Anathomopathologie', 'Anatomopathologiste'),
(73, 'A_DECH', '', 'Chirurgien dentiste'),
(74, 'A_DEPR', '', 'prothésiste dentaire'),
(75, 'A_KINE', '', 'Kinésitherapeute'),
(76, 'A_PODO', '', 'Podologue'),
(77, 'A_OSTE', '', 'Ostéopathe'),
(78, 'A_PSYL', '', 'Psychologue'),
(79, 'A_PSCH', '', 'Pschomotricien'),
(80, 'A_ORTH', '', 'Orthophniste'),
(81, 'A_ANGI', '', 'Angiologue'),
(82, 'A_ERGO', '', 'Ergothérapeute'),
(83, 'A_DIET', '', 'Diététicien nutritionniste');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `praticienspecialite`
--
ALTER TABLE `praticienspecialite`
  ADD PRIMARY KEY (`id_spe`),
  ADD UNIQUE KEY `id_speCat` (`id_speCat`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `praticienspecialite`
--
ALTER TABLE `praticienspecialite`
  MODIFY `id_spe` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
