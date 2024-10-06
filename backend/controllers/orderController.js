const { createOrder, findOrderByOrderId, getAllOrders, updateOrder, deleteOrder, getOrdersByUsername } = require('../models/Order');
const messages = require('../utils/messages.json');
const logger = require('../utils/logger');  // Import the logger

exports.getOrdersByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    logger.info(`Fetching orders for username: ${username}`);  // Log info

    const orders = await getOrdersByUsername(username);

    if (orders.length === 0) {
      logger.warn(`No orders found for username: ${username}`);  // Log warning if no orders found
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.No_Orders_Found,
      });
    }

    logger.info(`Orders successfully fetched for username: ${username}`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Orders_Fetch,
      orders,
    });
  } catch (error) {
    logger.error(`Error fetching orders by username: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.createNewOrder = async (req, res) => {
  try {
    const { order_id, items, address, amount, username } = req.body;
    logger.info(`Creating new order for username: ${username}`);  // Log info

    const order = await createOrder({ order_id, items, address, amount, username });

    logger.info(`Order created successfully for username: ${username}, order_id: ${order_id}`);
    return res.status(201).send({
      status_code: 201,
      success: true,
      message: messages.en.Orders.success.Order_Created,
      order,
    });
  } catch (error) {
    logger.error(`Error creating new order: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    logger.info(`Fetching order by order_id: ${order_id}`);  // Log info

    const order = await findOrderByOrderId(order_id);

    if (!order) {
      logger.warn(`Order not found with order_id: ${order_id}`);  // Log warning
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.Order_Not_Found,
      });
    }

    logger.info(`Order fetched successfully by order_id: ${order_id}`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Order_Fetch,
      order,
    });
  } catch (error) {
    logger.error(`Error fetching order by order_id: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    logger.info(`Fetching all orders`);  // Log info
    const orders = await getAllOrders();

    logger.info(`All orders fetched successfully`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Orders_Fetch,
      orders,
    });
  } catch (error) {
    logger.error(`Error fetching all orders: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const updatedData = req.body;
    logger.info(`Updating order with order_id: ${order_id}`);  // Log info

    const result = await updateOrder(order_id, updatedData);

    if (result[0] === 0) {
      logger.warn(`Order not found with order_id: ${order_id}`);  // Log warning
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.Order_Not_Found,
      });
    }

    logger.info(`Order updated successfully with order_id: ${order_id}`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Order_Updated,
    });
  } catch (error) {
    logger.error(`Error updating order with order_id: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    logger.info(`Deleting order with order_id: ${order_id}`);  // Log info

    const result = await deleteOrder(order_id);

    if (result === 0) {
      logger.warn(`Order not found with order_id: ${order_id}`);  // Log warning
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.Order_Not_Found,
      });
    }

    logger.info(`Order deleted successfully with order_id: ${order_id}`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Order_Deleted,
    });
  } catch (error) {
    logger.error(`Error deleting order with order_id: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message,
    });
  }
};
