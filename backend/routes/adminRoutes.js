const express = require("express");
const router = express.Router();
const {
  loginUser,
  verifyOtp,
  getUserByUsername,
  updateUser
} = require("../controllers/adminController");

// Authentication using JWT
const authMiddleware = require('../middleware/authMiddleware');

router.get("/:user_name",authMiddleware, getUserByUsername);
router.put("/update/:user_name",authMiddleware, updateUser);
router.post("/verifyOtp", verifyOtp);
router.post("/login", loginUser);


module.exports = router;