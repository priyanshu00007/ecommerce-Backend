const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, validate(schemas.cartItem), cartController.addItem);
router.put('/:id', authenticate, validate(schemas.cartUpdate), cartController.updateItem);
router.delete('/clear', authenticate, cartController.clearCart);
router.delete('/:id', authenticate, cartController.removeItem);

module.exports = router;
