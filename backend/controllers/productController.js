// controllers/productController.js
const { createProduct,
        findProductByProductId,
        getAllProducts,
        getUserProducts,
        updateProductByProductId,
        deleteProductByProductId, } = require('../models/Product');

const jwtDecode = require('jwt-decode');
const messages = require('../utils/messages.json');

// Add a product
exports.addProduct = async (req, res) => {
  const generateUniqueProductId = async () => {
    let product_id;
    let existingProduct;

    do {
      product_id = Math.floor(100000 + Math.random() * 900000).toString();
      existingProduct = await findProductByProductId(product_id);
    } while (existingProduct);

    return product_id;
  };

  try {
    const { title, price, description, image } = req.body;
    const { user_name } = req.user;
    if (!title || !price || !description || !image) {
      return res.status(400).json({
        status_code: 400,
        success: false,
        message: messages.en.Products.error.empty_fields,
      });
    }

    const product_id = await generateUniqueProductId();

    const product = await createProduct({
      title,
      price,
      description,
      image,
      product_id,
      createdBy: user_name,
      updatedBy: user_name,
    });

    return res.status(201).json({
      status_code: 201,
      success: true,
      message: messages.en.Products.success.new_Product,
      product,
    });
  } catch (error) {
    if (!res.headersSent) { 
      return res.status(500).json({
        status_code: 500,
        success: false,
        message: messages.en.Products.error.internal_server_error,
        error: error.message,
      });
    }
  }
};

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    const options = {
      limit: 10,
    };
    const products = await getAllProducts(options);
    return res.status(200).send({
      status_code:200,
      success: true,
      message: messages.en.Products.success.all_Products_Fetch,
      products,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Products.error.internal_server_error,
      error:error
    });
  }
};

// In your controller
exports.getUserProducts = async (req, res) => {
  try {
    const { userName } = req.params;

    if (!userName) {
      return res.status(400).json({
        status_code: 400,
        success: false,
        message: messages.en.Products.error.user_name_required,
      });
    }

    const options = {
      where: { createdBy: userName },
      limit: 10,
    };

    const products = await getUserProducts(userName, options);
    console.log(products);
    if (!res.headersSent) {
      return res.status(200).json({
        status_code: 200,
        success: true,
        message: messages.en.Products.success.fetched,
        products,
      });
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({
        status_code: 500,
        success: false,
        message: messages.en.Products.error.internal_server_error,
        error: error.message,
      });
    }
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { title, price, description, image } = req.body;
    const { user_name } = req.user;

    // Check for required fields
    if (!product_id || !user_name) {
      return res.status(400).json({
        success: false,
        message: messages.en.Products.error.empty_fields,
      });
    }

    // Find the product by ID
    const product = await findProductByProductId(product_id);

    // If product is not found
    if (!product) {
      return res.status(404).json({
        status_code: 404,
        success: false,
        message: messages.en.Products.error.product_not_found,
      });
    }

    // Prepare the updates
    const updates = {
      title: title || product.title,
      price: price || product.price,
      description: description || product.description,
      image: image || product.image,
      updatedBy: user_name,
    };

    // Update the product
    await updateProductByProductId(product_id, updates);

    // Fetch the updated product
    const updatedProduct = await findProductByProductId(product_id);

    // Send the updated product in response
    return res.status(200).json({
      status_code: 200,
      success: true,
      message: messages.en.Products.success.update,
      product: updatedProduct,
    });
  } catch (error) {
    // Handle errors and ensure headers are not already sent
    if (!res.headersSent) {
      return res.status(500).json({
        status_code: 500,
        success: false,
        message: messages.en.Products.error.internal_server_error,
        error: error.message,
      });
    }
  }
};


// Get a single product by product_id
exports.getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await findProductByProductId(product_id);

    if (product) {
      return res.status(200).send({
        status_code:200,
        success: true,
        message:messages.en.Products.success.fetched,
        product,
      });
    } else {
      return res.status(404).send({
        status_code:404,
        success: false,
        message: messages.en.Products.error.product_not_found,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status_code:500,
      success: false,
      message: messages.en.Products.error.internal_server_error,
      error: error.message,
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Check if the product exists
    const product = await findProductByProductId(product_id);

    if (!product) {
      return res.status(404).json({
        status_code: 404,
        success: false,
        message: messages.en.Products.error.product_not_found,
      });
    }

    // Delete the product
    await deleteProductByProductId(product_id);

    return res.status(200).json({
      success: true,
      message: messages.en.Products.success.delete,
    });
  } catch (error) {
    // Ensure that headers are not already sent
    if (!res.headersSent) {
      return res.status(500).json({
        status_code: 500,
        success: false,
        message: messages.en.Products.error.internal_server_error,
        error: error.message,
      });
    }
  }
};


exports.deleteAllUserProduct = async (req, res) => {
  try {
    const { user_name } = req.params;

    const products = await getUserProducts(user_name);

    if (!products) {
      return res.status(404).json({
        status_code: 404,
        success: false,
        message: messages.en.Products.error.product_not_found,
      });
    }

    products.forEach( async(product)=>{
      await deleteProductByProductId(product.dataValues.product_id);
    })

    // Delete the product
    // await deleteProductByProductId(product_id);

    return res.status(200).json({
      success: true,
      message: messages.en.Products.success.delete,
      products
    });
  } catch (error) {
    // Ensure that headers are not already sent
    if (!res.headersSent) {
      return res.status(500).json({
        status_code: 500,
        success: false,
        message: messages.en.Products.error.internal_server_error,
        error: error.message,
      });
    }
  }
};