const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const CartSchema = require('../Schema/cartSchema');

const Cart = sequelize.define('Cart', CartSchema, {
  tableName: 'carts',
  timestamps: false,
});

async function deleteCartByUsername(user_name) {
  return await Cart.destroy({ where: { user_name } });
}

async function createCart(data) {
  return await Cart.create(data);
}

async function findCartByUsername(user_name) {
  return await Cart.findAll({ where: { user_name } });
}

async function deleteCartByUsername(user_name) {
  return await Cart.destroy({ where: { user_name } });
}

async function getAllCarts(options = {}) {
  return await Cart.findAll({
    limit: 10, 
    ...options,
  });
}

async function findCartProductByUsername(user_name, product_id) {
  return await Cart.findOne({ 
    where: { 
      user_name, 
      product_id 
    } 
  });
}

async function deleteCartProductByUsername(user_name, product_id) {
  return await Cart.destroy({ 
    where: { 
      user_name, 
      product_id 
    } 
  });
}

module.exports = {
  createCart,
  findCartByUsername,
  deleteCartByUsername,
  getAllCarts,
  findCartProductByUsername,
  deleteCartProductByUsername,
  deleteCartByUsername,
};