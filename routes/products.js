const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

router.post('/', protect, authorizeRoles('vendor','admin'), productController.createProduct);
router.put('/:id', protect, authorizeRoles('vendor','admin'), productController.updateProduct);
router.delete('/:id', protect, authorizeRoles('vendor','admin'), productController.deleteProduct);

module.exports = router;
