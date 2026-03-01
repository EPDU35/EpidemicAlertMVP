const router = require('express').Router();
const { getAllCases, getRiskByLocation, broadcastToZone } = require('../controllers/ministry.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/cases', auth, role('authority'), getAllCases);
router.get('/risk', auth, role('authority'), getRiskByLocation);
router.post('/broadcast', auth, role('authority'), broadcastToZone);

module.exports = router;
