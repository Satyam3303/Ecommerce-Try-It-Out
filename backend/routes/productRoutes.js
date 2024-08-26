const express = require('express');
const router = express.Router();
const { 
    addProduct, 
    getAllProducts, 
    updateProduct, 
    getProductById, 
    deleteProduct,
    getUserProducts,
    deleteAllUserProduct
} = require('../controllers/productController');

// Authentication using JWT
const authMiddleware = require('../middleware/authMiddleware');

// Product Routes
router.post('/add', authMiddleware, addProduct);           
router.get('/all-products',authMiddleware, getAllProducts);  
router.get('/user-products/:userName',authMiddleware, getUserProducts);                   
router.get('/:product_id', getProductById);              
router.put('/update/:product_id', authMiddleware, updateProduct); 
router.delete('/delete/:product_id', authMiddleware, deleteProduct); 
router.delete('/delete-all-product/:user_name', authMiddleware, deleteAllUserProduct); 

module.exports = router;