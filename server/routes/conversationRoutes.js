const express = require("express");
const router = express.Router();

const {
  getOrCreateConversation,
} = require("../controllers/conversationController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/conversations", authMiddleware, getOrCreateConversation);

module.exports = router;
