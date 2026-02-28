const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connecte :', MONGO_URI);
    } catch (err) {
        console.error('Erreur connexion MongoDB :', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
