const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorizeAdmin, adminController.getDashboard);
router.get('/users', authenticate, authorizeAdmin, adminController.getUsers);
router.get('/reports/product-sales', authenticate, authorizeAdmin, adminController.getProductSalesReport);
router.get('/reports/daily-revenue', authenticate, authorizeAdmin, adminController.getDailyRevenue);

module.exports = router;
