const {
  createMessageService,
  getMessagesService,
  verifyConversationAccess,
} = require("../services/messageServices.js");

const createMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    if (!Number.isInteger(Number(conversationId))) {
      return res.status(400).json({
        message: "Invalid conversation ID",
      });
    }

    const conversation = await verifyConversationAccess(
      Number(conversationId),
      req.userId,
    );

    if (!conversation) {
      return res.status(403).json({
        message: "You are not part of this conversation",
      });
    }

    const message = await createMessageService(
      content,
      req.userId,
      Number(conversationId),
    );

    const io = req.app.get("io");

    const roomName = `conversation:${conversationId}`;

    io.to(roomName).emit("newMessage", message);

    res.json(message);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getMessage = async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);

    const conversation = await verifyConversationAccess(
      conversationId,
      req.userId,
    );

    if (!conversation) {
      return res.status(403).json({
        message: "You are not part of this conversation",
      });
    }

    const messages = await getMessagesService(conversationId);

    res.json(messages);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createMessage,
  getMessage,
};
