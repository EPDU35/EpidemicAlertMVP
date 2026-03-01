const router = require('express').Router();
const { reportCase, myCases, getAllCases, getCaseById } = require('../controllers/case.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.post('/', auth, role('citizen'), reportCase);
router.get('/mine', auth, role('citizen'), myCases);
router.get('/', auth, role('center', 'authority'), getAllCases);
router.get('/:id', auth, getCaseById);

module.exports = router;
