const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/auth/register", registerUser);

router.post("/auth/login", loginUser);

router.get("/profile", authMiddleware, getProfile);
module.exports = router;
