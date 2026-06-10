const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/', authenticate, orderController.placeOrder);
router.get('/', authenticate, orderController.getMyOrders);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);
router.get('/all', authenticate, authorizeAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, validate(schemas.orderStatus), orderController.updateOrderStatus);
router.get('/:id', authenticate, orderController.getOrderById);

module.exports = router;
