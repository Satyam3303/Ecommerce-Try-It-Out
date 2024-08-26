
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const ProductSchema = require('../Schema/productSchema');

const Product = sequelize.define('Product', ProductSchema, {
  tableName: 'products',
  timestamps: false,
});

async function createProduct(data) {
  return await Product.create(data);
}

async function findProductByProductId(product_id) {
  return await Product.findOne({ where: { product_id } });
}

async function getAllProducts(options) {
  return await Product.findAll(options);
}

async function getUserProducts(user_name, options = {}) {
  return await Product.findAll({
    where: { createdBy: user_name },
    ...options,
  });
}

async function updateProductByProductId(product_id, updates) {
  return await Product.update(updates, { where: { product_id } });
}

async function deleteProductByProductId(product_id) {
  return await Product.destroy({ where: { product_id } });
}

module.exports = {
  Product,
  createProduct,
  findProductByProductId,
  getAllProducts,
  updateProductByProductId,
  deleteProductByProductId,
  getUserProducts
};