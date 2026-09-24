const express = require("express");

const router = express.Router();

const {
  createMessage,
  getMessage,
} = require("../controllers/messageController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/messages", authMiddleware, createMessage);
router.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  getMessage,
);

module.exports = router;
