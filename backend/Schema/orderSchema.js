const { DataTypes } = require('sequelize');

const OrderSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  items: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

module.exports = OrderSchema;
