const { createCart, 
  findCartByUsername, 
  findCartProductByUsername,
  deleteCartProductByUsername, 
  deleteCartByUsername,
  getAllCarts } = require("../models/Cart");
  
const { Op } = require("sequelize");
const messages = require('../utils/messages.json');
const logger = require('../utils/logger');  // Import the logger


// Register a product in cart
exports.registerCart = async (req, res) => {
try {
  const { user_name, product_id, seller_user_name, quantity } = req.body;
  logger.info(`Registering product to cart for user: ${user_name}`);
  
  if (!user_name || !product_id || !seller_user_name || !quantity) {
    logger.warn(`Missing fields in request body: ${JSON.stringify(req.body)}`);
    return res.status(400).send({
      status_code: 400,
      success: false,
      message: messages.en.Users.error.empty_fields,
    });
  }

  const newCart = await createCart({
    user_name,
    product_id,
    seller_user_name,
    quantity,
    createdAt: new Date(),
  });

  logger.info(`Product registered in cart for user: ${user_name}, product_id: ${product_id}`);
  return res.status(201).send({
    status_code: 201,
    success: true,
    message: messages.en.Users.success.User_Create,
  });
} catch (error) {
  logger.error(`Error registering product in cart: ${error.message}`, { stack: error.stack });
  return res.status(500).send({
    status_code: 500,
    success: false,
    message: messages.en.Users.error.internal_server_error,
    error: error.message || error,
  });
}
};

exports.clearCartByUsername = async (req, res) => {
try {
  const { user_name } = req.params;
  logger.info(`Clearing cart for user: ${user_name}`);

  if (!user_name) {
    logger.warn(`Username not provided for clearing cart`);
    return res.status(400).send({
      status_code: 400,
      success: false,
      message: messages.en.Users.error.user_Name_Required,
    });
  }

  await deleteCartByUsername(user_name);
  logger.info(`Cart cleared successfully for user: ${user_name}`);

  return res.status(200).send({
    status_code: 200,
    success: true,
    message: messages.en.Customer.success.all_products_successfully_deleted,
  });
} catch (error) {
  logger.error(`Error clearing cart for user: ${user_name}`, { stack: error.stack });
  return res.status(500).send({
    status_code: 500,
    success: false,
    message: messages.en.Users.error.internal_server_error,
    error: error.message || error,
  });
}
};

// Get Cart By Username
exports.getCartByUsername = async (req, res) => {
try {
  const { user_name } = req.params;
  logger.info(`Fetching cart for user: ${user_name}`);

  if (!user_name) {
    logger.warn(`Username not provided for fetching cart`);
    return res.status(400).send({
      status_code: 400,
      success: false,
      message: messages.en.Users.error.user_Name_Required,
    });
  }

  const cart = await findCartByUsername(user_name);
  if (!cart || cart.length === 0) {
    logger.warn(`No cart found for user: ${user_name}`);
    return res.status(404).send({
      status_code: 404,
      success: false,
      message: messages.en.Users.error.User_Fetch,
    });
  }

  logger.info(`Cart fetched successfully for user: ${user_name}`);
  return res.status(200).send({
    status_code: 200,
    success: true,
    message: messages.en.Users.success.User_Fetch,
    cart,
  });
} catch (error) {
  logger.error(`Error fetching cart for user: ${user_name}`, { stack: error.stack });
  return res.status(500).send({
    status_code: 500,
    success: false,
    message: messages.en.Users.error.internal_server_error,
    error: error.message || error,
  });
}
};

// Delete from Cart
exports.deleteCartProductSingle = async (req, res) => {
try {
  const { user_name, product_id } = req.params;
  logger.info(`Deleting product from cart for user: ${user_name}, product_id: ${product_id}`);

  const cart = await findCartProductByUsername(user_name, product_id);
  if (!cart) {
    logger.warn(`Product not found in cart for user: ${user_name}, product_id: ${product_id}`);
    return res.status(404).send({
      status_code: 404,
      success: false,
      message: messages.en.Customer.error.product_not_found,
    });
  }

  await deleteCartProductByUsername(user_name, product_id);
  logger.info(`Product deleted from cart for user: ${user_name}, product_id: ${product_id}`);
  
  return res.status(200).send({
    status_code: 200,
    success: true,
    message: messages.en.Customer.success.product_successfully_deleted,
  });
} catch (error) {
  logger.error(`Error deleting product from cart for user: ${user_name}, product_id: ${product_id}`, { stack: error.stack });
  return res.status(500).send({
    status_code: 500,
    success: false,
    message: messages.en.Users.error.internal_server_error,
    error: error.message || "An unknown error occurred",
    stack: error.stack, 
  });
}
};

// Find from Cart
exports.findCartProductSingle = async (req, res) => {
try {
  const { user_name, product_id } = req.params;
  logger.info(`Finding product in cart for user: ${user_name}, product_id: ${product_id}`);

  const cart = await findCartProductByUsername(user_name, product_id);
  if (!cart) {
    logger.warn(`Product not found in cart for user: ${user_name}, product_id: ${product_id}`);
    return res.status(404).send({
      status_code: 404,
      success: false,
      message: messages.en.Customer.error.product_not_found,
    });
  }

  logger.info(`Product found in cart for user: ${user_name}, product_id: ${product_id}`);
  return res.status(200).send({
    status_code: 200,
    success: true,
    message: messages.en.Customer.success.product_successfully_found,
    cart,
  });
} catch (error) {
  logger.error(`Error finding product in cart for user: ${user_name}, product_id: ${product_id}`, { stack: error.stack });
  return res.status(500).send({
    status_code: 500,
    success: false,
    message: messages.en.Users.error.internal_server_error,
    error: error.message || error,
  });
}
};

// Get all carts
exports.getAllCarts = async (req, res) => {
try {
  logger.info(`Fetching all carts`);
  const users = await getAllCarts();

  logger.info(`All carts fetched successfully`);
  return res.status(200).send({
    status_code: 200,
    success: true,
    message: messages.en.Users.success.All_Users_Fetch,
    users,
  });
} catch (error) {
  logger.error(`Error fetching all carts: ${error.message}`, { stack: error.stack });
  return res.status(500).send({
    status_code: 500,
    success: false,
    message: messages.en.Users.error.internal_server_error,
    error: error.message || error,
  });
}
};
