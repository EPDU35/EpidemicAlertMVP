# Babi Alert — Backend API

## Installation

```bash
npm install
```

Crée un fichier `.env` à la racine :

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=ton_mot_de_passe
DB_NAME=epidemic_alert
JWT_SECRET=change_moi_en_prod
JWT_EXPIRES=7d
```

```bash
npm run dev   # développement
npm start     # production
```

---

## Schéma SQL

```sql
CREATE DATABASE IF NOT EXISTS epidemic_alert;
USE epidemic_alert;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('citizen', 'center', 'authority') NOT NULL,
  phone VARCHAR(20),
  location VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symptoms TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  disease_suspected VARCHAR(100),
  description TEXT,
  status ENUM('pending', 'confirmed', 'rejected', 'under_observation') DEFAULT 'pending',
  validated_by INT,
  validation_notes TEXT,
  validated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (validated_by) REFERENCES users(id)
);

CREATE TABLE alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  level ENUM('info', 'warning', 'danger', 'critical') NOT NULL,
  location VARCHAR(150) NOT NULL,
  disease VARCHAR(100),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE centers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  center_name VARCHAR(200) NOT NULL,
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  reference_id INT,
  reference_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Routes API

### Auth
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| GET | `/api/auth/me` | Tous | Profil connecté |

### Cas
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/cases` | citizen | Signaler un cas |
| GET | `/api/cases/mine` | citizen | Mes signalements |
| GET | `/api/cases` | center, authority | Tous les cas (filtrable: ?status=&location=) |
| GET | `/api/cases/:id` | Tous auth | Détail d'un cas |

### Centre de santé
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/center/cases/pending` | center | Cas en attente |
| PUT | `/api/center/cases/:id/validate` | center | Valider/rejeter un cas |

### Ministère
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/ministry/cases` | authority | Tous les cas |
| GET | `/api/ministry/risk?location=Abidjan&days=7` | authority | Niveau de risque par zone |
| POST | `/api/ministry/broadcast` | authority | Diffuser un message citoyen |

### Alertes
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/alerts` | Public | Liste alertes (filtrable: ?location=&level=) |
| GET | `/api/alerts/:id` | Public | Détail alerte |
| POST | `/api/alerts` | authority | Publier une alerte |
| DELETE | `/api/alerts/:id` | authority | Supprimer une alerte |

---

## Format réponse

Toutes les réponses suivent ce format :

```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "error": "message d'erreur" }
```
