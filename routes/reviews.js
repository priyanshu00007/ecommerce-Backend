const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/product/:productId', authenticate, reviewController.addReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
