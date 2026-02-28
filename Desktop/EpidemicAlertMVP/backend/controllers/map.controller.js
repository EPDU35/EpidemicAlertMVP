const Alert = require('../models/alert.model');
const Case = require('../models/report.model');
const Notification = require('../models/message.model');
const { erreur } = require('../utils/helpers');

function normaliserCommune(commune) {
    if (!commune) return null;
    return commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
const { calculerNiveauRisque } = require('../utils/thresholds');

const COMMUNES = [
    'abobo', 'adjame', 'anyama', 'attiecoube', 'cocody', 'koumassi',
    'marcory', 'plateau', 'port-bouet', 'treichville', 'yopougon',
    'bingerville', 'songon'
];

async function creerAlerte(req, res) {
    try {
        const { disease, commune, level, description } = req.body;

        if (!disease || !description) {
            return erreur(res, 'Maladie et description sont obligatoires.');
        }

        const alerte = await Alert.create({
            disease,
            commune: commune || null,
            level: level || 'moyen',
            description,
            active: true,
            createdBy: req.user._id
        });

        const communeNotif = commune ? normaliserCommune(commune) : null;
        const niveauLabel = { faible: 'faible', moyen: 'modere', eleve: 'eleve', critique: 'critique' }[level] || 'modere';
        const zoneLabel = commune ? `dans la commune de ${commune}` : 'sur l\'ensemble du district';

        await Notification.create({
            title: `Alerte ${disease} — Niveau ${niveauLabel}`,
            content: `Une alerte sanitaire a ete declaree ${zoneLabel}. ${description}`,
            type: 'alerte',
            commune: communeNotif,
            recipients: 'tous',
            createdBy: req.user._id
        });

        return res.status(201).json({ alert: alerte });
    } catch (err) {
        console.error('Erreur creerAlerte:', err);
        return erreur(res, 'Erreur lors de la creation de l\'alerte.', 500);
    }
}

async function listeAlertes(req, res) {
    try {
        const { commune, limit } = req.query;
        const filtre = {};

        if (commune) {
            filtre.$or = [
                { commune: null },
                { commune: { $regex: new RegExp(commune, 'i') } }
            ];
        }

        let query = Alert.find(filtre).sort({ createdAt: -1 });
        if (limit) query = query.limit(parseInt(limit));

        const alertes = await query;
        return res.json({ alerts: alertes });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement des alertes.', 500);
    }
}

async function donneesCarteAlertes(req, res) {
    try {
        const resultats = await Promise.all(COMMUNES.map(async (commune) => {
            const [totalCas, casValides, alertesActives] = await Promise.all([
                Case.countDocuments({ commune }),
                Case.countDocuments({ commune, status: 'valide' }),
                Alert.countDocuments({ commune: { $regex: new RegExp(commune, 'i') }, active: true })
            ]);

            const niveauRisque = calculerNiveauRisque(totalCas, alertesActives);

            return {
                commune: commune.charAt(0).toUpperCase() + commune.slice(1),
                total_cas: totalCas,
                cas_valides: casValides,
                alertes_actives: alertesActives,
                niveau_risque: niveauRisque
            };
        }));

        return res.json({ data: resultats });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement des donnees de la carte.', 500);
    }
}

async function mettreAJourAlerte(req, res) {
    try {
        const { id } = req.params;
        const alerte = await Alert.findByIdAndUpdate(id, req.body, { new: true });
        if (!alerte) return erreur(res, 'Alerte introuvable.', 404);
        return res.json({ alert: alerte });
    } catch (err) {
        return erreur(res, 'Erreur lors de la mise a jour de l\'alerte.', 500);
    }
}

module.exports = { creerAlerte, listeAlertes, donneesCarteAlertes, mettreAJourAlerte };
