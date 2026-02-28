const Case = require('../models/report.model');
const { erreur, normaliserCommune } = require('../utils/helpers');
const riskService = require('../services/risk.service');

async function creerCas(req, res) {
    try {
        const { commune, disease, description, location } = req.body;

        if (!commune || !description) {
            return erreur(res, 'Commune et description sont obligatoires.');
        }

        const cas = await Case.create({
            userId: req.user._id,
            userName: req.user.name,
            commune: normaliserCommune(commune),
            disease: disease || null,
            description,
            location: location || null,
            source: req.user.role === 'centre' ? 'centre' : 'citoyen',
            status: 'signale'
        });

        await riskService.evaluerRisqueCommune(normaliserCommune(commune));

        return res.status(201).json({ case: cas });
    } catch (err) {
        return erreur(res, 'Erreur lors de la creation du cas.', 500);
    }
}

async function mesCas(req, res) {
    try {
        const cas = await Case.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.json({ cases: cas });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement de vos cas.', 500);
    }
}

async function listeCas(req, res) {
    try {
        const { status, commune, page = 1, limite = 50 } = req.query;
        const filtre = {};

        if (status) {
            const statuts = status.split(',').map(s => s.trim());
            filtre.status = { $in: statuts };
        }

        if (commune) {
            filtre.commune = normaliserCommune(commune);
        }

        if (req.user.role === 'citoyen') {
            filtre.userId = req.user._id;
        }

        const cas = await Case.find(filtre)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limite)
            .limit(parseInt(limite));

        return res.json({ cases: cas });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement des cas.', 500);
    }
}

async function statsCas(req, res) {
    try {
        const filtre = {};
        if (req.user.role === 'citoyen') filtre.userId = req.user._id;

        const tous = await Case.find(filtre).select('status');
        const counts = {};
        tous.forEach(c => {
            counts[c.status] = (counts[c.status] || 0) + 1;
        });

        return res.json({ stats: counts });
    } catch (err) {
        return erreur(res, 'Erreur lors du calcul des statistiques.', 500);
    }
}

async function mettreAJourStatut(req, res) {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        const statutsAutorises = ['valide', 'rejete', 'pris_en_charge', 'clos', 'encadrement', 'en_attente'];
        if (!statutsAutorises.includes(status)) {
            return erreur(res, 'Statut invalide.');
        }

        const cas = await Case.findById(id);
        if (!cas) return erreur(res, 'Cas introuvable.', 404);

        if (req.user.role === 'citoyen' && cas.userId.toString() !== req.user._id.toString()) {
            return erreur(res, 'Acces refuse.', 403);
        }

        cas.status = status;
        if (note) cas.centerNote = note;
        if (req.user.role === 'centre') cas.centerId = req.user._id;
        await cas.save();

        await riskService.evaluerRisqueCommune(cas.commune);

        return res.json({ case: cas });
    } catch (err) {
        return erreur(res, 'Erreur lors de la mise a jour.', 500);
    }
}

module.exports = { creerCas, mesCas, listeCas, statsCas, mettreAJourStatut };
