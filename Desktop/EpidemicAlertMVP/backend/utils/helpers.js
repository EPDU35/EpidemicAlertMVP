const Case = require('../models/report.model');
const Alert = require('../models/alert.model');
const { calculerNiveauRisque } = require('../utils/thresholds');

async function evaluerRisqueCommune(commune) {
    try {
        const [totalCas, alertesActives] = await Promise.all([
            Case.countDocuments({ commune }),
            Alert.countDocuments({
                commune: { $regex: new RegExp(commune, 'i') },
                active: true
            })
        ]);

        const niveau = calculerNiveauRisque(totalCas, alertesActives);

        if (totalCas >= 10 && alertesActives === 0) {
            await Alert.create({
                disease: 'Surveillance automatique',
                commune: commune.charAt(0).toUpperCase() + commune.slice(1),
                level: 'eleve',
                description: `Seuil d'alerte atteint a ${commune}. ${totalCas} cas signales.`,
                active: true,
                createdBy: null
            });
        }

        return { commune, niveau, totalCas, alertesActives };
    } catch (err) {
        console.error('Erreur evaluation risque :', err.message);
    }
}

function erreur(res, message, statut = 400) {
    return res.status(statut).json({ message });
}

function normaliserCommune(commune) {
    if (!commune) return null;
    return commune
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

module.exports = { erreur, normaliserCommune, evaluerRisqueCommune };