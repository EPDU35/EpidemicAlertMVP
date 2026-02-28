const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// GET public ou connecté — OK pour tous
router.get('/', authMiddleware, alertesController.getListe);
router.get('/map', alertesController.getMap);

// POST réservé aux autorités sanitaires
router.post('/', authMiddleware, roleMiddleware('autorite'), alertesController.creer);

// PATCH réservé aux autorités
router.patch('/:id', authMiddleware, roleMiddleware('autorite'), alertesController.mettreAJour);