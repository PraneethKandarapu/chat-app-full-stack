const prisma = require("../lib/prisma.js");

const createMessageService = async (content, senderId, conversationId) => {
  const message = await prisma.message.create({
    data: {
      content: content,
      senderId: senderId,
      conversationId: conversationId,
    },

    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return message;
};

const verifyConversationAccess = async (conversationId, userId) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        {
          user1Id: userId,
        },
        {
          user2Id: userId,
        },
      ],
    },
  });

  return conversation;
};

const getMessagesService = async (conversationId) => {
  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },

    orderBy: {
      createdAt: "asc",
    },

    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return messages;
};

module.exports = {
  createMessageService,
  getMessagesService,
  verifyConversationAccess,
};
