const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/', authenticate, orderController.placeOrder);
router.get('/', authenticate, orderController.getMyOrders);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);
router.get('/all', authenticate, authorizeAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, orderController.updateOrderStatus);
router.get('/:id', authenticate, orderController.getOrderById);

module.exports = router;
