const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/', authenticate, validate(schemas.payment), paymentController.processPayment);
router.get('/status/:jobId', authenticate, paymentController.getPaymentStatus);
router.get('/:orderId', authenticate, paymentController.getPaymentByOrder);

module.exports = router;
