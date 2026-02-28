const express = require('express');
const router = express.Router();
const { resumeStats } = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/summary', auth, resumeStats);

module.exports = router;
