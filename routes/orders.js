const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/', protect, authorizeRoles('customer'), orderController.createOrder);
router.get('/', protect, orderController.getOrdersForUser);
router.put('/:id', protect, authorizeRoles('vendor','admin'), orderController.updateOrderStatus);

module.exports = router;
