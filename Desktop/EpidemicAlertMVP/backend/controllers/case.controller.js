const Case = require('../models/case.model');
const { notifyNewCase } = require('../services/notification.service');
const { ok, fail, requireFields } = require('../utils/helpers');

// citoyen — signaler un cas
const reportCase = async (req, res) => {
  const missing = requireFields(req.body, ['symptoms', 'location']);
  if (missing) return fail(res, `Champs manquants : ${missing.join(', ')}`);

  const { symptoms, location, disease_suspected, description } = req.body;
  const id = await Case.create({ user_id: req.user.id, symptoms, location, disease_suspected, description });

  // notifie les centres de la zone
  await notifyNewCase(id, location);

  return ok(res, { id }, 'Cas signalé avec succès', 201);
};

// citoyen — mes signalements
const myCases = async (req, res) => {
  const cases = await Case.findByUser(req.user.id);
  return ok(res, cases);
};

// tous les cas (filtrable) — center + authority
const getAllCases = async (req, res) => {
  const { status, location } = req.query;
  const cases = await Case.findAll({ status, location });
  return ok(res, cases);
};

// détail d'un cas
const getCaseById = async (req, res) => {
  const cas = await Case.findById(req.params.id);
  if (!cas) return fail(res, 'Cas introuvable', 404);
  return ok(res, cas);
};

module.exports = { reportCase, myCases, getAllCases, getCaseById };
