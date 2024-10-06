const { createProduct, 
  findProductByProductId, 
  getAllProducts, 
  getUserProducts, 
  updateProductByProductId, 
  deleteProductByProductId } = require('../models/Product');
const jwtDecode = require('jwt-decode');
const messages = require('../utils/messages.json');
const logger = require('../utils/logger'); // Importing logger

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
logger.warn('Product creation failed: missing fields');
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

logger.info(`Product created successfully: ${title} by ${user_name}`);
return res.status(201).json({
status_code: 201,
success: true,
message: messages.en.Products.success.new_Product,
product,
});
} catch (error) {
logger.error('Error during product creation', error);
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

logger.info('Fetched all products successfully');
return res.status(200).send({
status_code: 200,
success: true,
message: messages.en.Products.success.all_Products_Fetch,
products,
});
} catch (error) {
logger.error('Error fetching all products', error);
return res.status(500).send({
status_code: 500,
success: false,
message: messages.en.Products.error.internal_server_error,
error: error.message,
});
}
};

// Get user products
exports.getUserProducts = async (req, res) => {
try {
const { userName } = req.params;

if (!userName) {
logger.warn('Fetch user products failed: user_name required');
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
logger.info(`Fetched products for user: ${userName}`);
return res.status(200).json({
status_code: 200,
success: true,
message: messages.en.Products.success.fetched,
products,
});
} catch (error) {
logger.error('Error fetching user products', error);
return res.status(500).json({
status_code: 500,
success: false,
message: messages.en.Products.error.internal_server_error,
error: error.message,
});
}
};

// Update a product
exports.updateProduct = async (req, res) => {
try {
const { product_id } = req.params;
const { title, price, description, image } = req.body;
const { user_name } = req.user;

if (!product_id || !user_name) {
logger.warn('Update product failed: missing product_id or user_name');
return res.status(400).json({
  success: false,
  message: messages.en.Products.error.empty_fields,
});
}

const product = await findProductByProductId(product_id);

if (!product) {
logger.warn(`Update product failed: product not found - ID: ${product_id}`);
return res.status(404).json({
  status_code: 404,
  success: false,
  message: messages.en.Products.error.product_not_found,
});
}

const updates = {
title: title || product.title,
price: price || product.price,
description: description || product.description,
image: image || product.image,
updatedBy: user_name,
};

await updateProductByProductId(product_id, updates);

const updatedProduct = await findProductByProductId(product_id);
logger.info(`Product updated successfully: ${product_id} by ${user_name}`);
return res.status(200).json({
status_code: 200,
success: true,
message: messages.en.Products.success.update,
product: updatedProduct,
});
} catch (error) {
logger.error('Error updating product', error);
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
logger.info(`Fetched product successfully: ${product_id}`);
return res.status(200).send({
  status_code: 200,
  success: true,
  message: messages.en.Products.success.fetched,
  product,
});
} else {
logger.warn(`Product not found: ${product_id}`);
return res.status(404).send({
  status_code: 404,
  success: false,
  message: messages.en.Products.error.product_not_found,
});
}
} catch (error) {
logger.error('Error fetching product by ID', error);
return res.status(500).send({
status_code: 500,
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

const product = await findProductByProductId(product_id);

if (!product) {
logger.warn(`Delete product failed: product not found - ID: ${product_id}`);
return res.status(404).json({
  status_code: 404,
  success: false,
  message: messages.en.Products.error.product_not_found,
});
}

await deleteProductByProductId(product_id);
logger.info(`Product deleted successfully: ${product_id}`);
return res.status(200).json({
success: true,
message: messages.en.Products.success.delete,
});
} catch (error) {
logger.error('Error deleting product', error);
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

// Delete all user products
exports.deleteAllUserProduct = async (req, res) => {
try {
const { user_name } = req.params;

const products = await getUserProducts(user_name);

if (!products) {
logger.warn(`Delete all user products failed: no products found for user - ${user_name}`);
return res.status(404).json({
  status_code: 404,
  success: false,
  message: messages.en.Products.error.product_not_found,
});
}

for (const product of products) {
await deleteProductByProductId(product.dataValues.product_id);
logger.info(`Deleted product: ${product.dataValues.product_id} for user: ${user_name}`);
}

logger.info(`All products deleted for user: ${user_name}`);
return res.status(200).json({
success: true,
message: messages.en.Products.success.delete,
products,
});
} catch (error) {
logger.error('Error deleting all user products', error);
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
