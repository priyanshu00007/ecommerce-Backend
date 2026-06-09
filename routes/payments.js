const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, paymentController.processPayment);
router.get('/:orderId', authenticate, paymentController.getPaymentByOrder);

module.exports = router;
