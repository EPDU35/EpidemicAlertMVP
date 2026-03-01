const router = require('express').Router();
const { getPendingCases, validateCase } = require('../controllers/center.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/cases/pending', auth, role('center'), getPendingCases);
router.put('/cases/:id/validate', auth, role('center'), validateCase);

module.exports = router;
