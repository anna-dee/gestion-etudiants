-- Script MySQL équivalent au modèle Django (facultatif : `python manage.py migrate` crée déjà la table).
CREATE DATABASE IF NOT EXISTS gestion_etudiants
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_etudiants;

CREATE TABLE IF NOT EXISTS etudiants (
    matricule      VARCHAR(20)  NOT NULL,
    nom            VARCHAR(100) NOT NULL,
    prenom         VARCHAR(100) NOT NULL,
    date_naissance DATE         NOT NULL,
    email          VARCHAR(150) NOT NULL DEFAULT '',
    telephone      VARCHAR(20)  NOT NULL DEFAULT '',
    PRIMARY KEY (matricule)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
