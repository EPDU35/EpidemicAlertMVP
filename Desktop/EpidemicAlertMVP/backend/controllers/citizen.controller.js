const Notification = require('../models/message.model');
const { erreur, normaliserCommune } = require('../utils/helpers');

async function creerNotification(req, res) {
    try {
        const { title, content, type, commune, recipients } = req.body;

        if (!title || !content) {
            return erreur(res, 'Titre et contenu sont obligatoires.');
        }

        const notif = await Notification.create({
            title,
            content,
            type: type || 'notif',
            commune: commune ? normaliserCommune(commune) : null,
            recipients: recipients || 'tous',
            createdBy: req.user._id
        });

        return res.status(201).json({ notification: notif });
    } catch (err) {
        return erreur(res, 'Erreur lors de la creation de la notification.', 500);
    }
}

async function mesNotifications(req, res) {
    try {
        const { commune } = req.user;
        const filtre = {
            $or: [
                { commune: null },
                { commune: commune ? normaliserCommune(commune) : null }
            ]
        };

        const notifs = await Notification.find(filtre).sort({ createdAt: -1 }).limit(30);
        return res.json({ notifications: notifs });
    } catch (err) {
        return erreur(res, 'Erreur lors du chargement des notifications.', 500);
    }
}

module.exports = { creerNotification, mesNotifications };
