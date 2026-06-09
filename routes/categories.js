const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', authenticate, authorizeAdmin, categoryController.create);
router.put('/:id', authenticate, authorizeAdmin, categoryController.update);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.remove);

module.exports = router;
