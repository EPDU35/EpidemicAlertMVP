# Babi Alert — Plateforme de surveillance epidemique d'Abidjan

Systeme de detection et d'alerte epidemique pour les 13 communes du District Sanitaire d'Abidjan.

## Stack technique

- **Frontend** : HTML / CSS / JavaScript vanilla
- **Backend** : Node.js + Express.js
- **Base de donnees** : MongoDB + Mongoose
- **Auth** : JWT (jsonwebtoken) + bcryptjs
- **IA** : Moteur de regles maison (sans API externe)

## Structure du projet

```
epidemie-abidjan/
├── frontend/           HTML, CSS, JS du client
├── backend/            API Express
│   ├── config/         DB et variables d'env
│   ├── controllers/    Logique metier
│   ├── models/         Schemas Mongoose
│   ├── routes/         Endpoints API
│   ├── middlewares/    Auth JWT + roles
│   ├── services/       Risque, notification, IA
│   └── utils/          Helpers et seuils
├── ia/                 Moteur IA local
│   ├── knowledge/      Bases JSON (maladies, symptomes)
│   └── rules/          Detection, evaluation, reponse
├── database/
│   └── seed.js         Donnees initiales
└── package.json
```

## Installation

```bash
# Cloner le projet
git clone <repo>
cd epidemie-abidjan

# Installer les dependances
npm install

# Copier et configurer les variables d'environnement
cp backend/.env.example backend/.env

# Verifier que MongoDB est lance
mongod

# Peupler la base de donnees
npm run seed

# Demarrer le serveur
npm run dev
```

Le serveur tourne sur **http://localhost:3000**

## Comptes de test (apres seed)

| Email               | Mot de passe  | Role      |
|---------------------|---------------|-----------|
| citoyen@babi.ci     | password123   | Citoyen   |
| centre@babi.ci      | password123   | Centre    |
| autorite@babi.ci    | password123   | Autorite  |

## Routes API principales

### Auth
- `POST /api/auth/register` — Inscription citoyen
- `POST /api/auth/login` — Connexion tous roles
- `GET  /api/auth/me` — Utilisateur connecte

### Cas / Signalements
- `POST  /api/cases` — Creer un signalement
- `GET   /api/cases` — Lister les cas (filtre statut, commune)
- `GET   /api/cases/mine` — Mes cas (citoyen)
- `GET   /api/cases/stats` — Statistiques par statut
- `PATCH /api/cases/:id/status` — Mettre a jour le statut

### Alertes
- `GET  /api/alerts` — Liste des alertes
- `GET  /api/alerts/map` — Donnees par commune pour la carte
- `POST /api/alerts` — Creer une alerte (autorite)
- `PATCH /api/alerts/:id` — Modifier une alerte (autorite)

### Statistiques
- `GET /api/stats/summary` — Resume global (admin)

### Notifications
- `GET  /api/notifications/mine` — Mes notifications
- `POST /api/notifications` — Envoyer une notification (autorite/centre)

### IA
- `POST /api/ia/message` — Analyser un message citoyen

## Mode mock (frontend sans backend)

Dans `frontend/assets/js/api.js`, passer `MOCK_MODE = true` pour utiliser les donnees simulees sans avoir besoin du backend.

---

Developpe par les Vortexon
