const { createCart, 
    findCartByUsername, 
    findCartProductByUsername,
    deleteCartProductByUsername, 
    deleteCartByUsername,
    getAllCarts } = require("../models/Cart");
    
const { Op } = require("sequelize");

const messages = require('../utils/messages.json');


// Register a product in cart
exports.registerCart = async (req, res) => {
try {
const { user_name, product_id, seller_user_name, quantity } = req.body;
console.log("Request Body:", req.body);
if (!user_name ||  !product_id || !seller_user_name || !quantity) {
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

return res.status(201).send({
  status_code: 201,
  success: true,
  message: messages.en.Users.success.User_Create,
});
} catch (error) {
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

    // Ensure user_name is provided
    if (!user_name) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.user_Name_Required,
      });
    }

    // Delete all products related to the user from the carts table
    await deleteCartByUsername(user_name);

    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Customer.success.all_products_successfully_deleted,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// Get Cart By Username
exports.getCartByUsername = async (req, res) => {
  try {
    const { user_name } = req.params;

    if (!user_name) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.user_Name_Required,
      });
    }

    const cart = await findCartByUsername(user_name);

    if (!cart || cart.length === 0) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }


    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Fetch,
      cart,
    });
  } catch (error) {
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

    // Logic for deleting the cart product
    const cart = await findCartProductByUsername(user_name, product_id);

    if (!cart) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Customer.error.product_not_found,
      });
    }

    await deleteCartProductByUsername(user_name, product_id);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Customer.success.product_successfully_deleted,
    });
  } catch (error) {
    console.error(error); 
    
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

    // Logic for deleting the cart product
    const cart = await findCartProductByUsername(user_name, product_id);

    if (!cart) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Customer.error.product_not_found,
      });
    }

    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Customer.success.product_successfully_found,
      cart
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// Get all users
exports.getAllCarts = async (req, res) => {
try {
const users = await getAllCarts();

return res.status(200).send({
  status_code: 200,
  success: true,
  message: messages.en.Users.success.All_Users_Fetch,
  users,
});
} catch (error) {
return res.status(500).send({
  status_code: 500,
  success: false,
  message: messages.en.Users.error.internal_server_error,
  error,
});
}
};

