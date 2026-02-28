const express = require('express');
const router = express.Router();
const { register, login, moi } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, moi);

module.exports = router;
