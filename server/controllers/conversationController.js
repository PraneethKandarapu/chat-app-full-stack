const {
  getOrCreateConversationService,
} = require("../services/conversationServices.js");

const getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const targetUserId = Number(userId);

    if (!Number.isInteger(targetUserId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (targetUserId === req.userId) {
      return res.status(400).json({
        message: "You cannot create a conversation with yourself",
      });
    }

    const conversation = await getOrCreateConversationService(
      req.userId,
      targetUserId,
    );

    res.json(conversation);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getOrCreateConversation,
};
