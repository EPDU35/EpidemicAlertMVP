const Alert = require('../models/alert.model');
const { ok, fail, requireFields } = require('../utils/helpers');

// liste des alertes (public)
const getAlerts = async (req, res) => {
  const { location, level } = req.query;
  const alerts = await Alert.findAll({ location, level });
  return ok(res, alerts);
};

// détail d'une alerte
const getAlertById = async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) return fail(res, 'Alerte introuvable', 404);
  return ok(res, alert);
};

// publier une alerte — authority uniquement
const createAlert = async (req, res) => {
  const missing = requireFields(req.body, ['title', 'message', 'level', 'location']);
  if (missing) return fail(res, `Champs manquants : ${missing.join(', ')}`);

  const validLevels = ['info', 'warning', 'danger', 'critical'];
  const { title, message, level, location, disease } = req.body;

  if (!validLevels.includes(level)) {
    return fail(res, `Niveau invalide. Options : ${validLevels.join(', ')}`);
  }

  const id = await Alert.create({ title, message, level, location, disease, created_by: req.user.id });
  return ok(res, { id }, 'Alerte publiée', 201);
};

// supprimer une alerte — authority uniquement
const deleteAlert = async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) return fail(res, 'Alerte introuvable', 404);
  await Alert.delete(req.params.id);
  return ok(res, null, 'Alerte supprimée');
};

module.exports = { getAlerts, getAlertById, createAlert, deleteAlert };
