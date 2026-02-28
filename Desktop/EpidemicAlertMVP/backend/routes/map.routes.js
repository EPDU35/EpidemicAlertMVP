const express = require('express');
const router = express.Router();
const { creerAlerte, listeAlertes, donneesCarteAlertes, mettreAJourAlerte } = require('../controllers/map.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/map', donneesCarteAlertes);
router.get('/', listeAlertes);
router.post('/', auth, role('autorite'), creerAlerte);
router.patch('/:id', auth, role('autorite'), mettreAJourAlerte);

module.exports = router;
