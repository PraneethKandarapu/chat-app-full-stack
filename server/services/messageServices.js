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

const getMessagesService = async (conversationId) => {
  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return messages;
};

module.exports = {
  createMessageService,
  getMessagesService,
};
