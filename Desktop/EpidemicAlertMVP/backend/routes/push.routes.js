const express = require("express");
const router = express.Router();
const webpush = require("web-push");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
require("dotenv").config();

const abonnements = [];

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.error("[PUSH] Cles VAPID manquantes dans .env — notifications push desactivees.");
} else {
    webpush.setVapidDetails("mailto:admin@babi.ci", VAPID_PUBLIC, VAPID_PRIVATE);
}

router.get("/cle-publique", (req, res) => {
    if (!VAPID_PUBLIC) return res.status(503).json({ message: "Push non configure." });
    res.json({ clePublique: VAPID_PUBLIC });
});

router.post("/abonner", auth, (req, res) => {
    const { abonnement } = req.body;
    if (!abonnement || !abonnement.endpoint) {
        return res.status(400).json({ message: "Abonnement invalide." });
    }
    const existe = abonnements.find(a => a.endpoint === abonnement.endpoint);
    if (!existe) {
        abonnements.push({ ...abonnement, userId: req.user._id, commune: req.user.commune });
    }
    return res.json({ message: "Abonnement enregistre." });
});

router.post("/envoyer", auth, role("autorite", "centre"), async (req, res) => {
    if (!VAPID_PUBLIC) return res.status(503).json({ message: "Push non configure." });
    const { title, body, commune, url } = req.body;
    if (!title || !body) return res.status(400).json({ message: "Titre et corps requis." });

    const payload = JSON.stringify({ title, body, url: url || "/" });

    let cibles = abonnements;
    if (commune) {
        cibles = abonnements.filter(a => !a.commune || a.commune === commune.toLowerCase());
    }

    const resultats = await Promise.allSettled(
        cibles.map(ab => webpush.sendNotification(ab, payload))
    );

    const envoyes = resultats.filter(r => r.status === "fulfilled").length;
    const echecs  = resultats.filter(r => r.status === "rejected").length;

    return res.json({ message: `${envoyes} notification(s) envoyee(s), ${echecs} echec(s).` });
});

module.exports = { router, abonnements, webpush, VAPID_PUBLIC };
