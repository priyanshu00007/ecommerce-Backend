const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/product/:productId', authenticate, validate(schemas.review), reviewController.addReview);
router.put('/:id', authenticate, validate(schemas.review), reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
