const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    commune: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    disease: {
        type: String,
        default: null
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['signale', 'en_attente', 'encadrement', 'pris_en_charge', 'valide', 'rejete', 'clos'],
        default: 'signale'
    },
    source: {
        type: String,
        enum: ['citoyen', 'centre'],
        default: 'citoyen'
    },
    centerNote: {
        type: String,
        default: null
    },
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

caseSchema.index({ commune: 1, status: 1 });
caseSchema.index({ userId: 1 });

module.exports = mongoose.model('Case', caseSchema);
