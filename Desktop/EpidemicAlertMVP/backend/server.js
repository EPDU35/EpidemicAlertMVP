const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const db = require('./config/db');

// routes
const authRoutes = require('./routes/auth.routes');
const caseRoutes = require('./routes/case.routes');
const centerRoutes = require('./routes/center.routes');
const ministryRoutes = require('./routes/ministry.routes');
const alertRoutes = require('./routes/alert.routes');

const app = express();

app.use(cors());
app.use(express.json());

// test db au démarrage
db.getConnection()
  .then(conn => {
    console.log('✅ MySQL connecté');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erreur MySQL :', err.message);
    process.exit(1);
  });

// routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/center', centerRoutes);
app.use('/api/ministry', ministryRoutes);
app.use('/api/alerts', alertRoutes);

// route de base
app.get('/', (req, res) => {
  res.json({ message: 'Babi Alert API v1.0 — tout roule 🟢' });
});

// gestion erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
