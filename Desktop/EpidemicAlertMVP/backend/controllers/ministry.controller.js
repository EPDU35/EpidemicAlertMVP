const Case = require('../models/case.model');
const { calculateRisk } = require('../services/risk.service');
const { notifyRole } = require('../services/notification.service');
const { ok, fail, requireFields } = require('../utils/helpers');

// vue globale de tous les cas
const getAllCases = async (req, res) => {
  const { status, location } = req.query;
  const cases = await Case.findAll({ status, location });
  return ok(res, cases);
};

// analyse du risque par zone
const getRiskByLocation = async (req, res) => {
  const missing = requireFields(req.query, ['location']);
  if (missing) return fail(res, 'Paramètre location requis');

  const { location, days } = req.query;
  const risk = await calculateRisk(location, parseInt(days) || 7);
  return ok(res, risk);
};

// diffuser un message d'encadrement aux citoyens d'une zone
const broadcastToZone = async (req, res) => {
  const missing = requireFields(req.body, ['message', 'location']);
  if (missing) return fail(res, `Champs manquants : ${missing.join(', ')}`);

  const { message, location } = req.body;
  const count = await notifyRole('citizen', 'broadcast', message, location);
  return ok(res, { notified: count }, `Message envoyé à ${count} citoyen(s)`);
};

module.exports = { getAllCases, getRiskByLocation, broadcastToZone };
