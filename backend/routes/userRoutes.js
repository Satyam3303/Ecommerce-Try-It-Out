const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUserByUsername,
  deleteUser,
  updateUser,
  loginUser,
  getAllUsers,
  verifyOtp,
} = require("../controllers/userController");

// Authentication using JWT
const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", registerUser);
router.get("/:user_name",authMiddleware, getUserByUsername);
router.delete("/:user_name",authMiddleware, deleteUser);
router.put("/update/:user_name",authMiddleware, updateUser);
router.post("/login", loginUser);
router.get("/users/all-users",authMiddleware, getAllUsers);
router.post("/verifyOtp", verifyOtp);

module.exports = router;