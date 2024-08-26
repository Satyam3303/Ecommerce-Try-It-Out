const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const OrderSchema = require('../Schema/orderSchema');

const Order = sequelize.define('Order', OrderSchema, {
  tableName: 'orders',
  timestamps: false,
});

// Create a new order
async function createOrder(orderData) {
  return await Order.create(orderData);
}

// Find order by order_id
async function findOrderByOrderId(order_id) {
  return await Order.findOne({ where: { order_id } });
}

// Get all orders with optional filtering
async function getAllOrders(options = {}) {
  return await Order.findAll({
    limit: 10,
    ...options,
  });
}

// Update order by order_id
async function updateOrder(order_id, updatedData) {
  return await Order.update(updatedData, { where: { order_id } });
}

// Delete order by order_id
async function deleteOrder(order_id) {
  return await Order.destroy({ where: { order_id } });
}

// Get all orders by username
async function getOrdersByUsername(username) {
  return await Order.findAll({ where: { username } });
}

module.exports = {
  createOrder,
  findOrderByOrderId,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersByUsername,
};
