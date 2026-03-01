const router = require('express').Router();
const { getAlerts, getAlertById, createAlert, deleteAlert } = require('../controllers/alert.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', getAlerts);                                          // public
router.get('/:id', getAlertById);                                    // public
router.post('/', auth, role('authority'), createAlert);              // authority only
router.delete('/:id', auth, role('authority'), deleteAlert);         // authority only

module.exports = router;
