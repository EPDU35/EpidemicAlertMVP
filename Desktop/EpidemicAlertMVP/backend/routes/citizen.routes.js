const express = require('express');
const router = express.Router();
const { creerNotification, mesNotifications } = require('../controllers/citizen.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.use(auth);

router.get('/mine', mesNotifications);
router.post('/', role('autorite', 'centre'), creerNotification);

module.exports = router;
