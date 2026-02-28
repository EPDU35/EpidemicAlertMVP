const express = require('express');
const router = express.Router();
const { casParCentre } = require('../controllers/center.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/cases', auth, role('centre', 'autorite'), casParCentre);

module.exports = router;
