require('dotenv').config({ path: './backend/.env.example' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/babi-alert';

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connecte a MongoDB');

    const User = require('./backend/models/user.model');
    const Case = require('./backend/models/report.model');
    const Alert = require('./backend/models/alert.model');
    const Notification = require('./backend/models/message.model');

    await Promise.all([
        User.deleteMany(),
        Case.deleteMany(),
        Alert.deleteMany(),
        Notification.deleteMany()
    ]);

    console.log('Collections videes');

    const users = await User.create([
        {
            name: 'Amadou Diallo',
            email: 'citoyen@babi.ci',
            password: 'password123',
            role: 'citoyen',
            commune: 'cocody'
        },
        {
            name: 'Centre de Sante Cocody',
            email: 'centre@babi.ci',
            password: 'password123',
            role: 'centre',
            commune: 'cocody'
        },
        {
            name: 'Ministere de la Sante',
            email: 'autorite@babi.ci',
            password: 'password123',
            role: 'autorite',
            commune: null
        }
    ]);

    const citoyen = users[0];

    const cases = await Case.create([
        {
            userId: citoyen._id,
            userName: citoyen.name,
            commune: 'cocody',
            disease: 'Paludisme',
            description: 'Fievre forte depuis 2 jours, maux de tete intenses.',
            status: 'signale',
            source: 'citoyen'
        },
        {
            userId: citoyen._id,
            userName: citoyen.name,
            commune: 'cocody',
            disease: 'Typhoide',
            description: 'Douleurs abdominales, perte d\'appetit depuis 4 jours.',
            status: 'pris_en_charge',
            source: 'citoyen',
            centerNote: 'Patient pris en charge au CHU Cocody.'
        },
        {
            userId: citoyen._id,
            userName: 'Fatoumata Kone',
            commune: 'abobo',
            disease: 'Cholera',
            description: 'Diarrhee aigue, vomissements importants.',
            status: 'en_attente',
            source: 'citoyen'
        },
        {
            userId: citoyen._id,
            userName: 'Konan Yao',
            commune: 'yopougon',
            disease: 'Paludisme',
            description: 'Frissons, sueurs nocturnes, fievre 39.5.',
            status: 'valide',
            source: 'centre',
            centerNote: 'Confirme au laboratoire.'
        },
        {
            userId: citoyen._id,
            userName: 'Ama Adjoua',
            commune: 'adjame',
            disease: 'Dengue',
            description: 'Fortes douleurs articulaires, eruption cutanee.',
            status: 'signale',
            source: 'citoyen'
        }
    ]);

    await Alert.create([
        {
            disease: 'Paludisme',
            commune: 'Cocody',
            level: 'moyen',
            description: 'Augmentation des cas de paludisme dans la commune de Cocody.',
            active: true
        },
        {
            disease: 'Cholera',
            commune: 'Abobo',
            level: 'eleve',
            description: 'Flambee de cholera detectee a Abobo. Consommez uniquement de l\'eau potable.',
            active: true
        },
        {
            disease: 'Dengue',
            commune: 'Adjame',
            level: 'moyen',
            description: 'Plusieurs cas de dengue signales a Adjame.',
            active: true
        }
    ]);

    await Notification.create([
        {
            title: 'Alerte Cocody',
            content: 'Risque paludisme eleve dans votre commune. Dormez sous moustiquaire.',
            type: 'notif',
            commune: 'cocody',
            recipients: 'commune'
        },
        {
            title: 'Rappel prevention',
            content: 'Lavez-vous les mains regulierement. Buvez de l\'eau potable uniquement.',
            type: 'info',
            commune: null,
            recipients: 'tous'
        }
    ]);

    console.log('Seed termine avec succes.');
    console.log('Comptes crees :');
    console.log('  citoyen@babi.ci  / password123  (role: citoyen)');
    console.log('  centre@babi.ci   / password123  (role: centre)');
    console.log('  autorite@babi.ci / password123  (role: autorite)');

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('Erreur seed :', err.message);
    process.exit(1);
});
