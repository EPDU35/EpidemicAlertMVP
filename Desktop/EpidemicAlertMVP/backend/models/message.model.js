const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['alerte', 'notif', 'info'],
        default: 'notif'
    },
    commune: {
        type: String,
        default: null
    },
    recipients: {
        type: String,
        enum: ['tous', 'commune', 'centres'],
        default: 'tous'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
