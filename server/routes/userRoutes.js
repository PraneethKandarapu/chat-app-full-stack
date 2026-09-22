const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController.js");

const { getAllUsers } = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/auth/register", registerUser);

router.post("/auth/login", loginUser);

router.get("/profile", authMiddleware, getProfile);
router.get("/users", authMiddleware, getAllUsers);
module.exports = router;
