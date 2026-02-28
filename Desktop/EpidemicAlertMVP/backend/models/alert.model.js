const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: true
    },
    commune: {
        type: String,
        default: null
    },
    level: {
        type: String,
        enum: ['faible', 'moyen', 'eleve'],
        default: 'moyen'
    },
    description: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

alertSchema.index({ active: 1, commune: 1 });

module.exports = mongoose.model('Alert', alertSchema);
