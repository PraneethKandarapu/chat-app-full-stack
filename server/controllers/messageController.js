const {
  createMessageService,
  getMessagesService,
} = require("../services/messageServices.js");

const createMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;

    const message = await createMessageService(
      content,
      req.userId,
      conversationId,
    );

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
