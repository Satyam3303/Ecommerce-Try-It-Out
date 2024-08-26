const express = require('express');
const router = express.Router();
const {
  createNewOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersByUsername
} = require('../controllers/orderController');


const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createNewOrder);
router.get('/:order_id', authMiddleware, getOrderById);
router.get('/', authMiddleware, getAllOrders);
router.put('/update/:order_id', authMiddleware, updateOrder);
router.delete('/delete/:order_id', authMiddleware, deleteOrder);
router.get('/by-username/:username',authMiddleware, getOrdersByUsername);

module.exports = router;
