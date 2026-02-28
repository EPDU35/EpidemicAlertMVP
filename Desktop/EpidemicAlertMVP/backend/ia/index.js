const detectDisease = require('./rules/detectDisease');
const assessRisk = require('./rules/assessRisk');
const generateResponse = require('./rules/generateResponse');
const symptoms = require('./knowledge/symptoms.json');

function detectSymptoms(msg) {
    return symptoms
        .filter(s => s.mots_cles.some(mot => msg.includes(mot.toLowerCase())))
        .map(s => s.nom);
}

function detectCommune(msg) {
    const communes = [
        'abobo', 'adjame', 'anyama', 'attiecoube', 'cocody',
        'koumassi', 'marcory', 'plateau', 'port-bouet', 'treichville',
        'yopougon', 'bingerville', 'songon'
    ];
    return communes.find(c => msg.includes(c)) || null;
}

function analyser(message) {
    const msg = message.toLowerCase();
    const symptomesDetectes = detectSymptoms(msg);
    const maladiesSuspectes = detectDisease(symptomesDetectes);
    const niveauRisque = assessRisk(symptomesDetectes, maladiesSuspectes);
    const commune = detectCommune(msg);

    return generateResponse({ message: msg, symptomesDetectes, maladiesSuspectes, niveauRisque, commune });
}

module.exports = { analyser };
