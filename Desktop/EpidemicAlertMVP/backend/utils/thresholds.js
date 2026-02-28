const SEUILS = {
    eleve: 10,
    moyen: 4,
    faible: 1
};

function calculerNiveauRisque(totalCas, alertesActives) {
    if (alertesActives >= 2 || totalCas >= SEUILS.eleve) return 'eleve';
    if (alertesActives >= 1 || totalCas >= SEUILS.moyen) return 'moyen';
    if (totalCas >= SEUILS.faible) return 'faible';
    return 'aucun';
}

module.exports = { SEUILS, calculerNiveauRisque };
