const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const SECRET_KEY = process.env.SECRET_KEY; 

const generateToken = (user) => {
  if (!user || !user.user_name || !user.email || !user.name || !user.phone) {
    throw new Error('Invalid user data');
  }

  return jwt.sign(
    {
      user_name: user.user_name,
      email: user.email,
      name: user.name,
      phone: user.phone,
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };