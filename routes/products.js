const router = require('express').Router();
const productController = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const { upload } = require('../middleware/upload');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorizeAdmin, validate(schemas.product), productController.create);
router.post('/upload', authenticate, authorizeAdmin, upload.single('image'), productController.uploadImage);
router.put('/:id', authenticate, authorizeAdmin, validate(schemas.product), productController.update);
router.delete('/:id', authenticate, authorizeAdmin, productController.remove);

module.exports = router;
