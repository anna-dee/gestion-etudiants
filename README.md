# Gestion des étudiants (Django + React + MySQL)

Fonctionnalités : connexion (login), liste paginée avec recherche, ajout / modification / suppression,
export PDF, calculs automatiques (âge, âge moyen, répartitions) et **Dashboard** avec graphiques
(bouton « Dashboard » dans la barre latérale).

## Prérequis
Python 3.10+, Node.js 18+, MySQL (ou MariaDB) démarré.

## 1. Base de données MySQL
Dans MySQL (ligne de commande ou phpMyAdmin) :

    CREATE DATABASE gestion_etudiants CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

(Le fichier `backend/schema.sql` contient l'équivalent, mais `migrate` crée déjà la table `etudiants`.)

## 2. Backend (terminal n°1)

    cd backend
    python -m venv venv
    venv\Scripts\activate          # Windows   (Mac/Linux : source venv/bin/activate)
    pip install -r requirements.txt
    copy .env.example .env         # Mac/Linux : cp .env.example .env
    # ouvrir .env et mettre votre mot de passe MySQL dans DB_PASSWORD
    python manage.py migrate
    python manage.py seed          # crée admin / admin123 + 37 étudiants de démo
    python manage.py runserver

Si l'installation de `mysqlclient` échoue sous Windows : `pip install pymysql`, puis ajouter en haut de
`backend/config/__init__.py` :

    import pymysql
    pymysql.install_as_MySQLdb()

## 3. Frontend (terminal n°2)

    cd frontend
    npm install
    npm run dev

Ouvrir http://localhost:5173 puis se connecter avec **admin / admin123**
(changez ce mot de passe : `python manage.py changepassword admin`).

## Structure
- `backend/students/models.py` : table `etudiants` (matricule, nom, prenom, date_naissance, email, telephone)
- `backend/students/views.py` : login, API paginée, statistiques du dashboard
- `frontend/src/pages/` : Login, Dashboard (graphiques), Etudiants (liste, pagination, export PDF)
- `frontend/src/components/Layout.jsx` : barre latérale avec le bouton Dashboard
