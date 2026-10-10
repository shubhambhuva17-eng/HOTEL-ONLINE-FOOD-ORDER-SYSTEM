const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/stats/summary', orderController.getOrderStats);
router.get('/analytics', orderController.getAnalytics);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
