const Notification = require('../models/notification.model');
const db = require('../config/db');

// notifie un utilisateur spécifique
const notify = async (user_id, type, message, reference_id = null, reference_type = null) => {
  return Notification.create({ user_id, type, message, reference_id, reference_type });
};

// notifie tous les utilisateurs d'un rôle donné (ex: 'citizen' d'une zone)
const notifyRole = async (role, type, message, location = null) => {
  let query = 'SELECT id FROM users WHERE role = ?';
  const params = [role];
  if (location) {
    query += ' AND location LIKE ?';
    params.push(`%${location}%`);
  }
  const [users] = await db.query(query, params);

  const promises = users.map(u =>
    Notification.create({ user_id: u.id, type, message, reference_id: null, reference_type: null })
  );
  await Promise.all(promises);

  return users.length; // nb de notifs envoyées
};

// notifie les centres de santé d'un nouveau cas à traiter
const notifyNewCase = async (caseId, location) => {
  return notifyRole(
    'center',
    'new_case',
    `Nouveau cas signalé à ${location} — ID #${caseId}. Veuillez valider.`,
    location
  );
};

// notifie le citoyen du statut de son cas
const notifyCaseUpdate = async (user_id, caseId, status) => {
  const messages = {
    confirmed: `Votre signalement #${caseId} a été confirmé par un centre de santé.`,
    rejected: `Votre signalement #${caseId} n'a pas pu être confirmé.`,
    under_observation: `Votre signalement #${caseId} est sous observation médicale.`,
  };
  const message = messages[status] || `Votre signalement #${caseId} a été mis à jour : ${status}`;
  return notify(user_id, 'case_update', message, caseId, 'case');
};

module.exports = { notify, notifyRole, notifyNewCase, notifyCaseUpdate };
