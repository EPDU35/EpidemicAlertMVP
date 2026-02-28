const express = require('express');
const router = express.Router();
const { creerCas, mesCas, listeCas, statsCas, mettreAJourStatut } = require('../controllers/report.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.use(auth);

router.post('/', creerCas);
router.get('/mine', mesCas);
router.get('/stats', statsCas);
router.get('/', listeCas);
router.patch('/:id/status', role('centre', 'autorite', 'citoyen'), mettreAJourStatut);

module.exports = router;
