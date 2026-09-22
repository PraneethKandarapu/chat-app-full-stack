const prisma = require("../lib/prisma.js");

const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
  return users;
};

module.exports = { getAllUsersService };
