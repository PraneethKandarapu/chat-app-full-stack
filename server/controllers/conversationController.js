const {
  getOrCreateConversationService,
} = require("../services/conversationServices.js");

const getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = await getOrCreateConversationService(
      req.userId,
      userId,
    );

    res.json(conversation);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { getOrCreateConversation };
