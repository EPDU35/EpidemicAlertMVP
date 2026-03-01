// réponse succès standardisée
const ok = (res, data, message = 'Succès', code = 200) => {
  return res.status(code).json({ success: true, message, data });
};

// réponse erreur standardisée
const fail = (res, message = 'Erreur', code = 400) => {
  return res.status(code).json({ success: false, error: message });
};

// vérifie que les champs requis sont présents dans req.body
const requireFields = (body, fields) => {
  const missing = fields.filter(f => body[f] === undefined || body[f] === '');
  return missing.length ? missing : null;
};

module.exports = { ok, fail, requireFields };
