async function envoyerSMS(telephone, message) {
    console.log(`[SMS] -> ${telephone} : ${message}`);
}

async function envoyerWhatsApp(telephone, message) {
    console.log(`[WhatsApp] -> ${telephone} : ${message}`);
}

async function notifierCommune(commune, message) {
    console.log(`[NOTIF] Commune ${commune} : ${message}`);
}

module.exports = { envoyerSMS, envoyerWhatsApp, notifierCommune };
