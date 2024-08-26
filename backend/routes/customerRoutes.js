const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  getCustomerByUsername,
  deleteCustomer,
  updateCustomer,
  loginCustomer,
  getAllCustomers,
  verifyOtp,
} = require("../controllers/customerController");

// Authentication using JWT
const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", registerCustomer);
router.get("/:user_name",authMiddleware, getCustomerByUsername);
router.delete("/:user_name",authMiddleware, deleteCustomer);
router.put("/update/:user_name",authMiddleware, updateCustomer);
router.post("/login", loginCustomer);
router.get("/users",authMiddleware, getAllCustomers);
router.post("/verifyOtp", verifyOtp);

module.exports = router;