const { Sequelize } = require('sequelize');

//Database Details
const sequelize = new Sequelize('express-test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

//Used for Authentiction

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;