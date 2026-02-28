const symptoms = require('../knowledge/symptoms.json');

function assessRisk(symptomesDetectes, maladiesSuspectes) {
    if (!symptomesDetectes || symptomesDetectes.length === 0) return 'faible';

    const graviteMax = symptomesDetectes.reduce((max, nomSymptome) => {
        const sym = symptoms.find(s => s.nom === nomSymptome);
        return sym ? Math.max(max, sym.gravite) : max;
    }, 0);

    if (graviteMax >= 5) return 'urgence';
    if (graviteMax >= 3) return 'eleve';
    if (maladiesSuspectes && maladiesSuspectes.length > 0) return 'moyen';
    if (graviteMax >= 2) return 'moyen';
    return 'faible';
}

module.exports = assessRisk;
