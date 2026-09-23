const prisma = require("../lib/prisma.js");

const createMessageService = async (content, senderId, conversationId) => {
  const message = await prisma.message.create({
    data: {
      content: content,
      senderId: senderId,
      conversationId: conversationId,
    },
  });

  return message;
};

module.exports = {
  createMessageService,
};
