const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger'); 

const app = express();
const port = 5000;
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Handle syntax errors in JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error(`Invalid JSON format: ${err.message}`);
    return res.status(400).json({
      status_code: 400,
      success: false,
      message: 'Invalid JSON format',
      error: err.message,
    });
  }
  next(err); 
});


// Route handling
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.use((err, req, res, next) => {
  logger.error(`Error ${err.status || 500}: ${err.message}`);
  res.status(err.status || 500).send({
    status_code: err.status || 500,
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(port, () => {
  logger.info(`Server app listening on port ${port}!`);
  console.log(`Server app listening on port ${port}!`);
});
