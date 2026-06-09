const router = require('express').Router();
const productController = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorizeAdmin, productController.create);
router.put('/:id', authenticate, authorizeAdmin, productController.update);
router.delete('/:id', authenticate, authorizeAdmin, productController.remove);

module.exports = router;
