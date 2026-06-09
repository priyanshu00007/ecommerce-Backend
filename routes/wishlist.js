const router = require('express').Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, wishlistController.getWishlist);
router.post('/', authenticate, wishlistController.addItem);
router.delete('/:id', authenticate, wishlistController.removeItem);

module.exports = router;
