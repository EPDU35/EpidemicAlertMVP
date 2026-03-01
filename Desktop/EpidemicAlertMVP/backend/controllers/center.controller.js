const Case = require('../models/case.model');
const { notifyCaseUpdate } = require('../services/notification.service');
const { ok, fail, requireFields } = require('../utils/helpers');

// liste des cas en attente de validation
const getPendingCases = async (req, res) => {
  const cases = await Case.findPending();
  return ok(res, cases);
};

// valider / rejeter un cas
const validateCase = async (req, res) => {
  const missing = requireFields(req.body, ['status']);
  if (missing) return fail(res, `Champs manquants : ${missing.join(', ')}`);

  const validStatuses = ['confirmed', 'rejected', 'under_observation'];
  const { status, notes } = req.body;

  if (!validStatuses.includes(status)) {
    return fail(res, `Statut invalide. Options : ${validStatuses.join(', ')}`);
  }

  const cas = await Case.findById(req.params.id);
  if (!cas) return fail(res, 'Cas introuvable', 404);

  await Case.updateStatus(req.params.id, status, req.user.id, notes);

  // notifie le citoyen qui a signalé
  await notifyCaseUpdate(cas.user_id, cas.id, status);

  return ok(res, null, `Cas mis à jour : ${status}`);
};

module.exports = { getPendingCases, validateCase };
