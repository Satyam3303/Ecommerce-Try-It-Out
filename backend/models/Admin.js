const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const AdminSchema = require('../Schema/adminSchema');

const Admin = sequelize.define('Admin', AdminSchema, {
  tableName: 'admin',
  timestamps: false,
});

async function findUserByEmail(email) {
  return await Admin.findOne({ where: { email } });
}


async function findUserByPhone(phone) {
  return await Admin.findOne({ where: { phone } });
}

async function findUserByUsername(user_name) {
  return await Admin.findOne({ where: { user_name } });
}

async function getAllUsers(options = {}) {
  return await Admin.findAll({
    limit: 10, 
    ...options,
  });
}

module.exports = {
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
  findUserByPhone
};
