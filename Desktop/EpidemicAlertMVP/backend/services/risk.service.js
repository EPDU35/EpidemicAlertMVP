// calcul simple du niveau de risque basé sur le nb de cas confirmés dans une zone
const Case = require('../models/case.model');

const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const calculateRisk = async (location, days = 7) => {
  const stats = await Case.countByStatusAndLocation(location, days);

  const confirmed = stats.find(s => s.status === 'confirmed')?.count || 0;
  const pending = stats.find(s => s.status === 'pending')?.count || 0;

  // score pondéré : cas confirmés comptent double
  const score = confirmed * 2 + pending;

  let level;
  if (score >= 20) level = RISK_LEVELS.CRITICAL;
  else if (score >= 10) level = RISK_LEVELS.HIGH;
  else if (score >= 4) level = RISK_LEVELS.MEDIUM;
  else level = RISK_LEVELS.LOW;

  return { level, score, confirmed, pending, location, days };
};

module.exports = { calculateRisk, RISK_LEVELS };
