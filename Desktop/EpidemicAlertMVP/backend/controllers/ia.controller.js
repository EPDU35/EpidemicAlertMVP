const iaService = require('../services/ia.service');
const { erreur } = require('../utils/helpers');

async function traiterMessage(req, res) {
    try {
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return erreur(res, 'Message vide.');
        }

        const reponse = await iaService.analyserMessage(message.trim());

        return res.json({ succes: true, reponse });
    } catch (err) {
        return erreur(res, 'Erreur lors du traitement par l\'IA.', 500);
    }
}

module.exports = { traiterMessage };
