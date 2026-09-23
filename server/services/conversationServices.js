const prisma = require("../lib/prisma.js");
const getOrCreateConversationService = async (user1Id, user2Id) => {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        {
          user1Id: user1Id,
          user2Id: user2Id,
        },
        {
          user1Id: user2Id,
          user2Id: user1Id,
        },
      ],
    },
  });
  console.log(existingConversation);
  if (existingConversation) return existingConversation;

  const newConversation = prisma.conversation.create({
    data: {
      user1Id: user1Id,
      user2Id: user2Id,
    },
  });
  return newConversation;
};

module.exports = { getOrCreateConversationService };
