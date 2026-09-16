const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma.js");

const registerUserService = async (username, email, password) => {
  const hashedPass = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPass,
    },
  });
  return user;
};

const loginUserService = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) return null;

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return null;
  }

  return user;
};

const getProfileService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

module.exports = { registerUserService, loginUserService, getProfileService };
