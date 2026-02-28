const advice = require('../knowledge/advice.json');
const diseases = require('../knowledge/diseases.json');

const CENTRES = {
    abobo:      'CHU Abobo, Quartier SOGEFIA, Abobo',
    adjame:     'Centre de Sante Adjame, Marche Adjame',
    cocody:     'CHU de Cocody, Avenue Pierre et Marie Curie',
    yopougon:   'CHU de Yopougon, Zone industrielle',
    koumassi:   'Centre de Sante Koumassi, rue 12',
    marcory:    'Centre de Sante Marcory, Boulevard VGE',
    treichville:'Centre de Sante Treichville, Avenue 15',
    plateau:    'PISAM Plateau, Boulevard de la Republique',
    'port-bouet': 'Centre de Sante Port-Bouet, Aeroport zone',
    anyama:     'Centre de Sante Anyama',
    bingerville:'Centre de Sante Bingerville',
    songon:     'Centre de Sante Songon',
    attiecoube: 'Centre de Sante Attiecoube'
};

function generateResponse({ message, symptomesDetectes, maladiesSuspectes, niveauRisque, commune }) {
    if (niveauRisque === 'urgence') {
        return {
            type: 'urgence',
            message: 'Situation potentiellement urgente. Appelez le SAMU au 185 ou les Sapeurs-Pompiers au 180 immediatement. Ne restez pas seul.'
        };
    }

    if (estQuestionCentre(message)) {
        const adresse = commune && CENTRES[commune] ? CENTRES[commune] : null;
        return {
            type: 'orientation',
            message: adresse
                ? `Le centre de sante le plus proche de ${commune} est : ${adresse}.`
                : 'Indiquez-moi votre commune et je vous oriente vers le centre de sante le plus proche. Communes disponibles : Abobo, Cocody, Yopougon...'
        };
    }

    if (estQuestionPrevention(message)) {
        const maladie = maladiesSuspectes && maladiesSuspectes[0] ? maladiesSuspectes[0].nom.toLowerCase() : null;
        const conseil = maladie && advice[maladie] ? advice[maladie].conseil : advice.general.conseil;
        return {
            type: 'prevention',
            message: conseil
        };
    }

    if (estQuestionSignalement(message)) {
        return {
            type: 'information',
            message: 'Pour signaler un cas, cliquez sur "Signaler un cas" dans le menu. Remplissez votre commune, les symptomes observes et soumettez. Les autorites sanitaires examineront votre signalement.'
        };
    }

    if (symptomesDetectes.length > 0) {
        if (niveauRisque === 'eleve') {
            const maladie = maladiesSuspectes && maladiesSuspectes[0] ? maladiesSuspectes[0].nom : null;
            const adresse = commune && CENTRES[commune] ? ` Rendez-vous a : ${CENTRES[commune]}.` : ' Consultez le centre de sante de votre commune.';
            return {
                type: 'alerte',
                message: `Ces symptomes peuvent indiquer ${maladie ? 'un(e) ' + maladie : 'une infection grave'}. Consultez un medecin sans attendre.${adresse}`
            };
        }

        if (maladiesSuspectes && maladiesSuspectes.length > 0) {
            const principale = maladiesSuspectes[0];
            const maladieDonnees = diseases.find(d => d.id === principale.nom.toLowerCase());
            const adresse = commune && CENTRES[commune] ? ` Centre recommande : ${CENTRES[commune]}.` : '';
            return {
                type: 'conseil',
                message: `D'apres vos symptomes, un(e) ${principale.nom} est possible (${principale.correspondance}% de correspondance). ${maladieDonnees ? maladieDonnees.prevention[0] + '.' : ''}${adresse} Consultez un medecin pour confirmation.`
            };
        }

        return {
            type: 'conseil',
            message: `J'ai identifie ces symptomes : ${symptomesDetectes.join(', ')}. Si ils persistent plus de 48 heures ou s'aggravent, consultez un centre de sante. Reposez-vous et hydratez-vous.`
        };
    }

    return {
        type: 'information',
        message: "Je suis l'assistant sanitaire Babi Alert. Decrivez vos symptomes (fievre, toux, diarrhee...) et votre commune pour que je puisse vous orienter."
    };
}

function estQuestionCentre(msg) {
    const mots = ['centre', 'hopital', 'clinique', 'medecin', 'ou aller', 'proche', 'sante'];
    return mots.some(m => msg.includes(m));
}

function estQuestionPrevention(msg) {
    const mots = ['prevenir', 'prevention', 'proteger', 'eviter', 'comment ne pas', 'moustique'];
    return mots.some(m => msg.includes(m));
}

function estQuestionSignalement(msg) {
    const mots = ['signaler', 'declarer', 'reporter', 'comment signaler'];
    return mots.some(m => msg.includes(m));
}

module.exports = generateResponse;
