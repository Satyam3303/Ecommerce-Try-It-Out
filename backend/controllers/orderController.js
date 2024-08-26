const { createOrder, findOrderByOrderId, getAllOrders, updateOrder, deleteOrder, getOrdersByUsername } = require('../models/Order');
const messages = require('../utils/messages.json');

exports.getOrdersByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    // Fetch orders based on the username
    const orders = await getOrdersByUsername(username);
    
    if (orders.length === 0) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.No_Orders_Found,
      });
    }
    
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Orders_Fetch,
      orders,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching orders by username:', error);

    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error: error.message, // Send back the error message
      stack: error.stack,   // Send back the stack trace for debugging
    });
  }
};
// Create a new order
exports.createNewOrder = async (req, res) => {
  try {
    const { order_id, items, address, amount, username } = req.body;
    
    const order = await createOrder({ order_id, items, address, amount, username });
    
    return res.status(201).send({
      status_code: 201,
      success: true,
      message: messages.en.Orders.success.Order_Created,
      order,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error, // Make sure 'error' is correctly defined
    });
  }
};

// Get order by order_id
exports.getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await findOrderByOrderId(order_id);
    
    if (!order) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.Order_Not_Found,
      });
    }
    
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Order_Fetch,
      order,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error,
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Orders_Fetch,
      orders,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error,
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const updatedData = req.body;
    
    const result = await updateOrder(order_id, updatedData);
    
    if (result[0] === 0) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.Order_Not_Found,
      });
    }
    
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Order_Updated,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error,
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    
    const result = await deleteOrder(order_id);
    
    if (result === 0) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Orders.error.Order_Not_Found,
      });
    }
    
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Orders.success.Order_Deleted,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Orders.error.internal_server_error,
      error,
    });
  }
};
