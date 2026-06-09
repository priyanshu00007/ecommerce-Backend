const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, cartController.addItem);
router.put('/:id', authenticate, cartController.updateItem);
router.delete('/:id', authenticate, cartController.removeItem);
router.delete('/', authenticate, cartController.clearCart);

module.exports = router;
