const Case = require('../models/report.model');
const { erreur } = require('../utils/helpers');

async function casParCentre(req, res) {
    try {
        const { status } = req.query;
        const filtre = {};
        if (status) {
            const statuts = status.split(',').map(s => s.trim());
            filtre.status = { $in: statuts };
        }
        const cas = await Case.find(filtre).sort({ createdAt: -1 });
        return res.json({ cases: cas });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement des cas.', 500);
    }
}

module.exports = { casParCentre };
