const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { erreur } = require('../utils/helpers');

function genererToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register(req, res) {
    try {
        const { name, email, password, commune, role } = req.body;

        if (!name || !email || !password) {
            return erreur(res, 'Nom, email et mot de passe sont obligatoires.');
        }

        if (password.length < 8) {
            return erreur(res, 'Le mot de passe doit contenir au moins 8 caracteres.');
        }

        const existe = await User.findOne({ email: email.toLowerCase() });
        if (existe) {
            return erreur(res, 'Cet email est deja utilise.');
        }

        const roleAutorise = ['citoyen'].includes(role) ? role : 'citoyen';

        const user = await User.create({
            name,
            email,
            password,
            commune: commune || null,
            role: roleAutorise
        });

        const token = genererToken(user._id);

        return res.status(201).json({ token, user: user.toPublic() });
    } catch (err) {
        return erreur(res, 'Erreur lors de l\'inscription.', 500);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return erreur(res, 'Email et mot de passe requis.');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return erreur(res, 'Email ou mot de passe incorrect.', 401);
        }

        const valide = await user.verifierMotDePasse(password);
        if (!valide) {
            return erreur(res, 'Email ou mot de passe incorrect.', 401);
        }

        if (!user.actif) {
            return erreur(res, 'Compte desactive. Contactez l\'administration.', 403);
        }

        const token = genererToken(user._id);

        return res.json({ token, user: user.toPublic() });
    } catch (err) {
        return erreur(res, 'Erreur lors de la connexion.', 500);
    }
}

async function moi(req, res) {
    return res.json({ user: req.user.toPublic() });
}

module.exports = { register, login, moi };
