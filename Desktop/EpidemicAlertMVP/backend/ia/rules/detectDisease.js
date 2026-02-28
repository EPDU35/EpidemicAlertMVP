const diseaseSymptoms = require('../knowledge/disease_symptoms.json');

function detectDisease(symptomesDetectes) {
    if (!symptomesDetectes || symptomesDetectes.length === 0) return [];

    const scores = Object.entries(diseaseSymptoms).map(([maladie, symptomes]) => {
        const correspondances = symptomes.filter(s => symptomesDetectes.includes(s));
        const pourcentage = Math.round((correspondances.length / symptomes.length) * 100);
        return { maladie, correspondances, pourcentage };
    });

    return scores
        .filter(s => s.pourcentage >= 25)
        .sort((a, b) => b.pourcentage - a.pourcentage)
        .slice(0, 3)
        .map(s => ({
            nom: s.maladie.charAt(0).toUpperCase() + s.maladie.slice(1),
            correspondance: s.pourcentage
        }));
}

module.exports = detectDisease;
