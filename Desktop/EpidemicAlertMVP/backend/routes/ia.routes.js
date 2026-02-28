const express = require('express');
const router = express.Router();
const { analyserMessage } = require('../services/ia.service');

router.post('/message', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ succes: false, message: 'Message vide.' });
        }
        const reponse = await analyserMessage(message.trim());
        return res.json({ succes: true, reponse });
    } catch (err) {
        console.error('Erreur IA :', err.message);
        return res.status(500).json({ succes: false, message: 'Erreur interne.' });
    }
});

router.post('/suivi', async (req, res) => {
    try {
        const { evolution, nouveauxSymptomes, temperature, entourageMalade, joursSymptomes } = req.body;

        const donneesSuivi = { evolution, nouveauxSymptomes, temperature, entourageMalade, joursSymptomes };

        let score = 0;
        if (evolution === 'pire') score += 3;
        else if (evolution === 'pareil') score += 1;
        if (temperature && parseFloat(temperature) >= 39.5) score += 2;
        if (entourageMalade === true || entourageMalade === 'oui') score += 3;
        if (joursSymptomes && parseInt(joursSymptomes) >= 5) score += 2;

        let statut = 'stable';
        let messageReponse = 'Vos symptomes semblent stables. Continuez a vous reposer et a bien vous hydrater.';
        let type = 'conseil';

        if (score >= 7) {
            statut = 'critique';
            type = 'urgence';
            messageReponse = 'Votre etat necessite une attention medicale immediate. Appelez le SAMU au 185 maintenant.';
        } else if (score >= 3) {
            statut = 'aggravation';
            type = 'alerte';
            messageReponse = 'Votre etat semble s\'aggraver. Consultez un centre de sante rapidement.';
        }

        return res.json({
            succes: true,
            evaluation: { statut, nouveauStatutCas: statut === 'critique' ? 'encadrement' : null },
            reponse: { type, message: messageReponse }
        });
    } catch (err) {
        return res.status(500).json({ succes: false, message: 'Erreur lors du suivi.' });
    }
});

module.exports = router;
