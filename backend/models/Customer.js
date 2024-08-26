const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const CustomerSchema = require('../Schema/customerSchema');

const Customer = sequelize.define('Customer', CustomerSchema, {
  tableName: 'customers',
  timestamps: false,
});


async function createCustomer(data) {
  return await Customer.create(data);
}

async function findCustomerByEmail(email) {
  return await Customer.findOne({ where: { email } });
}

async function findCustomerByPhone(phone) {
  return await Customer.findOne({ where: { phone } });
}

async function findCustomerByUsername(user_name) {
  return await Customer.findOne({ where: { user_name } });
}

async function deleteCustomerByUsername(user_name) {
  return await Customer.destroy({ where: { user_name } });
}

async function getAllCustomers(options = {}) {
  return await Customer.findAll({
    limit: 10, 
    ...options,
  });
}

module.exports = {
  createCustomer,
  findCustomerByEmail,
  findCustomerByPhone,
  findCustomerByUsername,
  deleteCustomerByUsername,
  getAllCustomers,
};
