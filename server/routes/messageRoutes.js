const express = require("express");

const router = express.Router();

const { createMessage } = require("../controllers/messageController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/messages", authMiddleware, createMessage);

module.exports = router;
