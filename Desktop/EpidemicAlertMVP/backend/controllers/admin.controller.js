const Case = require('../models/report.model');
const Alert = require('../models/alert.model');
const User = require('../models/user.model');
const { erreur } = require('../utils/helpers');
const { calculerNiveauRisque } = require('../utils/thresholds');

const COMMUNES = [
    'abobo', 'adjame', 'anyama', 'attiecoube', 'cocody', 'koumassi',
    'marcory', 'plateau', 'port-bouet', 'treichville', 'yopougon',
    'bingerville', 'songon'
];

async function resumeStats(req, res) {
    try {
        const [totalCases, validatedCases, activeAlerts] = await Promise.all([
            Case.countDocuments(),
            Case.countDocuments({ status: 'valide' }),
            Alert.countDocuments({ active: true })
        ]);

        const communesAvecCas = await Case.distinct('commune');
        const affectedCommunes = communesAvecCas.length;

        const communesData = await Promise.all(COMMUNES.map(async (commune) => {
            const [casSignales, casValides, alertesActives] = await Promise.all([
                Case.countDocuments({ commune }),
                Case.countDocuments({ commune, status: 'valide' }),
                Alert.countDocuments({ commune: { $regex: new RegExp(commune, 'i') }, active: true })
            ]);

            return {
                commune,
                name: commune.charAt(0).toUpperCase() + commune.slice(1),
                casSignales,
                casValides,
                alertesActives,
                niveau: calculerNiveauRisque(casSignales, alertesActives)
            };
        }));

        return res.json({
            totalCases,
            validatedCases,
            activeAlerts,
            affectedCommunes,
            communes: communesData
        });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement des statistiques.', 500);
    }
}

module.exports = { resumeStats };
