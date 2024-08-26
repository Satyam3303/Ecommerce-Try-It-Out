const express = require("express");
const router = express.Router();
const {
  registerCart,
  getCartByUsername,
  getAllCarts,
  deleteCartProductSingle,
  findCartProductSingle,
  clearCartByUsername
} = require("../controllers/cartController");

// Authentication using JWT
const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", registerCart);
router.get("/:user_name",authMiddleware, getCartByUsername);
router.get("/find/:user_name/:product_id",authMiddleware, findCartProductSingle);
router.delete("/deleteProduct/:user_name/:product_id", authMiddleware, deleteCartProductSingle);
router.get("/users",authMiddleware, getAllCarts);
router.delete("/clear/:user_name", authMiddleware, clearCartByUsername);

module.exports = router;