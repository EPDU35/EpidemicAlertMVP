const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/env');
const { ok, fail, requireFields } = require('../utils/helpers');

const register = async (req, res) => {
  const missing = requireFields(req.body, ['name', 'email', 'password', 'role']);
  if (missing) return fail(res, `Champs manquants : ${missing.join(', ')}`);

  const { name, email, password, role, phone, location } = req.body;

  const validRoles = ['citizen', 'center', 'authority'];
  if (!validRoles.includes(role)) return fail(res, 'Rôle invalide');

  const existing = await User.findByEmail(email);
  if (existing) return fail(res, 'Email déjà utilisé', 409);

  const hashed = await bcrypt.hash(password, 10);
  const id = await User.create({ name, email, password: hashed, role, phone, location });

  const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return ok(res, { token, user: { id, name, email, role } }, 'Compte créé', 201);
};

const login = async (req, res) => {
  const missing = requireFields(req.body, ['email', 'password']);
  if (missing) return fail(res, `Champs manquants : ${missing.join(', ')}`);

  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return fail(res, 'Email ou mot de passe incorrect', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return fail(res, 'Email ou mot de passe incorrect', 401);

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Connexion réussie');
};

const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return fail(res, 'Utilisateur introuvable', 404);
  return ok(res, user);
};

module.exports = { register, login, me };
